const TeamMember = require('../models/TeamMember');
const { logAudit } = require('../utils/auditLogger');

// GET /api/team (Public)
const getTeamMembers = async (req, res) => {
  try {
    const team = await TeamMember.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/team/admin/all (Admin)
const getAllTeamMembersAdmin = async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/team (Admin)
const createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    await logAudit(req, 'CREATED_TEAM_MEMBER', 'Team', member._id, `Added team member "${member.name}"`);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/team/:id (Admin)
const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    await logAudit(req, 'UPDATED_TEAM_MEMBER', 'Team', member._id, `Updated team member "${member.name}"`);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/team/:id (Admin)
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    await logAudit(req, 'DELETED_TEAM_MEMBER', 'Team', member._id, `Deleted team member "${member.name}"`);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembersAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
