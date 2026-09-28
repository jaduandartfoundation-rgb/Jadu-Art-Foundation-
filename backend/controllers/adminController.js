const AdminUser = require('../models/AdminUser');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');
const Enquiry = require('../models/Enquiry');
const DonationInitiative = require('../models/DonationInitiative');
const Story = require('../models/Story');
const GalleryItem = require('../models/GalleryItem');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../utils/auditLogger');

// GET /api/admin/stats (Real Database Stats & Overview)
const getAdminStats = async (req, res) => {
  try {
    const totalDonationsCount = await Donation.countDocuments({ status: 'success' });
    const donations = await Donation.find({ status: 'success' });
    const totalAmountRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    // Calculate this month's total raised
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthDonations = await Donation.find({
      status: 'success',
      createdAt: { $gte: firstDayOfMonth }
    });
    const thisMonthAmountRaised = thisMonthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

    const volunteerCount = await Volunteer.countDocuments();
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
    const enquiryCount = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const activeInitiatives = await DonationInitiative.countDocuments({ status: 'active', published: true });
    const totalStories = await Story.countDocuments();
    const totalGalleryItems = await GalleryItem.countDocuments();

    // Recent 5 donations
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 audit activity logs
    const recentActivities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalDonationsCount,
        totalAmountRaised,
        thisMonthAmountRaised,
        volunteerCount,
        pendingVolunteers,
        enquiryCount,
        newEnquiries,
        activeInitiatives,
        totalStories,
        totalGalleryItems,
        recentDonations,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users (Super Admin)
const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/users (Super Admin)
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({
      name,
      email,
      passwordHash,
      role: role || 'admin'
    });

    await logAudit(req, 'CREATED_ADMIN_USER', 'AdminUser', user._id, `Created admin user "${user.email}" (${user.role})`);
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/users/:id (Super Admin)
const updateAdminUser = async (req, res) => {
  try {
    const { password, ...updateFields } = req.body;

    if (password) {
      updateFields.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await AdminUser.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAudit(req, 'UPDATED_ADMIN_USER', 'AdminUser', user._id, `Updated admin user "${user.email}"`);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:id (Super Admin)
const deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAudit(req, 'DELETED_ADMIN_USER', 'AdminUser', user._id, `Deleted admin user "${user.email}"`);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getAuditLogs
};
