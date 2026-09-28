const { Work, WorkCategory } = require('../models/Work');
const { logAudit } = require('../utils/auditLogger');

// GET /api/work (Public - Published & Not Deleted)
const getWorks = async (req, res) => {
  try {
    const filter = { published: true, deleted: false };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }
    const works = await Work.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: works });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/work/categories (Public)
const getWorkCategories = async (req, res) => {
  try {
    const categories = await WorkCategory.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/work/:slug (Public)
const getWorkBySlug = async (req, res) => {
  try {
    const work = await Work.findOne({ slug: req.params.slug, deleted: false });
    if (!work) {
      return res.status(404).json({ success: false, message: 'Work program not found' });
    }
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/work/admin/all (Admin)
const getAllWorksAdmin = async (req, res) => {
  try {
    const works = await Work.find({ deleted: false }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: works });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/work (Admin)
const createWork = async (req, res) => {
  try {
    const { title, slug } = req.body;
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const work = await Work.create({
      ...req.body,
      slug: generatedSlug
    });

    await logAudit(req, 'CREATED_WORK', 'Work', work._id, `Created work item "${work.title}"`);
    res.status(201).json({ success: true, data: work });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/work/:id (Admin)
const updateWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!work) {
      return res.status(404).json({ success: false, message: 'Work program not found' });
    }

    await logAudit(req, 'UPDATED_WORK', 'Work', work._id, `Updated work item "${work.title}"`);
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/work/:id (Admin - Soft Deletion)
const deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!work) {
      return res.status(404).json({ success: false, message: 'Work program not found' });
    }

    await logAudit(req, 'DELETED_WORK', 'Work', work._id, `Soft deleted work item "${work.title}"`);
    res.json({ success: true, message: 'Work program deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/work/categories (Admin)
const createWorkCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await WorkCategory.create({ ...req.body, slug });
    
    await logAudit(req, 'CREATED_WORK_CATEGORY', 'Work', category._id, `Created category "${name}"`);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWorks,
  getWorkCategories,
  getWorkBySlug,
  getAllWorksAdmin,
  createWork,
  updateWork,
  deleteWork,
  createWorkCategory
};
