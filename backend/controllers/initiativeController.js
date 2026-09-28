const DonationInitiative = require('../models/DonationInitiative');
const Donation = require('../models/Donation');
const { logAudit } = require('../utils/auditLogger');

// Helper to compute raised amount and progress for initiative(s)
const attachFinancialData = async (initiatives) => {
  const isArray = Array.isArray(initiatives);
  const items = isArray ? initiatives : [initiatives];

  if (items.length === 0) return isArray ? [] : null;

  const itemIds = items.map(item => item._id);

  // Aggregate verified successful donations per initiative
  const donationTotals = await Donation.aggregate([
    {
      $match: {
        initiativeId: { $in: itemIds },
        status: 'success'
      }
    },
    {
      $group: {
        _id: '$initiativeId',
        totalDonated: { $sum: '$amount' }
      }
    }
  ]);

  const totalsMap = {};
  donationTotals.forEach(dt => {
    totalsMap[dt._id.toString()] = dt.totalDonated;
  });

  const processed = items.map(item => {
    const obj = item.toObject ? item.toObject() : { ...item };
    const donatedFromPayments = totalsMap[obj._id.toString()] || 0;
    const manualAdj = obj.manualAdjustment || 0;
    const raisedAmount = donatedFromPayments + manualAdj;
    const targetAmount = obj.targetAmount || 1;
    const progress = Math.min(100, Math.round((raisedAmount / targetAmount) * 100));

    return {
      ...obj,
      raisedAmount,
      progress,
      isGoalReached: raisedAmount >= targetAmount
    };
  });

  return isArray ? processed : processed[0];
};

// GET /api/initiatives (Public - Active & Completed, Published)
const getInitiatives = async (req, res) => {
  try {
    const filter = {
      published: true,
      status: { $in: ['active', 'completed'] }
    };

    if (req.query.category && req.query.category !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }

    const initiatives = await DonationInitiative.find(filter).sort({ featured: -1, createdAt: -1 });
    const result = await attachFinancialData(initiatives);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/initiatives/featured (Public - Featured & Published)
const getFeaturedInitiatives = async (req, res) => {
  try {
    const initiatives = await DonationInitiative.find({
      published: true,
      featured: true,
      status: { $in: ['active', 'completed'] }
    }).limit(4).sort({ createdAt: -1 });

    const result = await attachFinancialData(initiatives);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching featured initiatives:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/initiatives/all (Admin only - all records)
const getAllInitiativesAdmin = async (req, res) => {
  try {
    const initiatives = await DonationInitiative.find().sort({ createdAt: -1 });
    const result = await attachFinancialData(initiatives);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching all initiatives:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/initiatives/:slug (Public - single initiative by slug)
const getInitiativeBySlug = async (req, res) => {
  try {
    const initiative = await DonationInitiative.findOne({ slug: req.params.slug });
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    const result = await attachFinancialData(initiative);

    // Fetch related active initiatives
    const related = await DonationInitiative.find({
      published: true,
      _id: { $ne: initiative._id },
      status: { $in: ['active', 'completed'] }
    }).limit(3);
    const processedRelated = await attachFinancialData(related);

    res.json({ 
      success: true, 
      data: {
        ...result,
        relatedInitiatives: processedRelated
      }
    });
  } catch (error) {
    console.error('Error fetching initiative by slug:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/initiatives (Admin)
const createInitiative = async (req, res) => {
  try {
    const { title, slug } = req.body;
    
    // Auto slugify if slug not explicitly provided
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const initiative = await DonationInitiative.create({
      ...req.body,
      slug: generatedSlug
    });

    await logAudit(req, 'CREATED_INITIATIVE', 'Initiative', initiative._id, `Created initiative "${initiative.title}"`);
    const result = await attachFinancialData(initiative);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating initiative:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/initiatives/:id (Admin)
const updateInitiative = async (req, res) => {
  try {
    // Note: frontend cannot update calculated raisedAmount directly
    const { raisedAmount, progress, ...updateData } = req.body;

    const initiative = await DonationInitiative.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    await logAudit(req, 'UPDATED_INITIATIVE', 'Initiative', initiative._id, `Updated initiative "${initiative.title}"`);
    const result = await attachFinancialData(initiative);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating initiative:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/initiatives/:id (Admin)
const deleteInitiative = async (req, res) => {
  try {
    const initiative = await DonationInitiative.findByIdAndDelete(req.params.id);
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }
    await logAudit(req, 'DELETED_INITIATIVE', 'Initiative', initiative._id, `Deleted initiative "${initiative.title}"`);
    res.json({ success: true, message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/initiatives/:id/updates (Admin - Add Timeline Update)
const addInitiativeUpdate = async (req, res) => {
  try {
    const initiative = await DonationInitiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    initiative.updates.unshift(req.body);
    await initiative.save();

    await logAudit(req, 'ADDED_INITIATIVE_UPDATE', 'Initiative', initiative._id, `Added timeline update "${req.body.title}"`);
    const result = await attachFinancialData(initiative);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/initiatives/:id/updates/:updateId (Admin - Delete Update)
const deleteInitiativeUpdate = async (req, res) => {
  try {
    const initiative = await DonationInitiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    initiative.updates = initiative.updates.filter((u) => u._id.toString() !== req.params.updateId);
    await initiative.save();

    await logAudit(req, 'DELETED_INITIATIVE_UPDATE', 'Initiative', initiative._id, `Deleted update ID ${req.params.updateId}`);
    const result = await attachFinancialData(initiative);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInitiatives,
  getFeaturedInitiatives,
  getAllInitiativesAdmin,
  getInitiativeBySlug,
  createInitiative,
  updateInitiative,
  deleteInitiative,
  addInitiativeUpdate,
  deleteInitiativeUpdate
};
