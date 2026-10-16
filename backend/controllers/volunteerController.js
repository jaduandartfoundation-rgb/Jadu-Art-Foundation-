const Volunteer = require('../models/Volunteer');
const { logAudit } = require('../utils/auditLogger');

const ALLOWED_STATUSES = [
  'New',
  'Contacted',
  'Under Review',
  'Approved',
  'Joined',
  'On Hold',
  'Rejected',
  'Inactive'
];

// Helper to normalize legacy statuses
const normalizeVolunteer = (volunteerDoc) => {
  if (!volunteerDoc) return null;
  const obj = typeof volunteerDoc.toObject === 'function' ? volunteerDoc.toObject() : { ...volunteerDoc };
  if (obj.status === 'pending') {
    obj.status = 'New';
  } else if (obj.status === 'accepted') {
    obj.status = 'Approved';
  } else if (!obj.status || !ALLOWED_STATUSES.includes(obj.status)) {
    obj.status = 'New';
  }
  return obj;
};

// POST /api/volunteers (Public applicant submission)
const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, city, interest, message, skills, availability } = req.body;
    
    if (!name || !email || !phone || !city || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields (name, email, phone, city, interest)' 
      });
    }

    const volunteer = await Volunteer.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      interest: interest.trim(),
      message: message ? message.trim() : '',
      skills: skills ? skills.trim() : '',
      availability: availability ? availability.trim() : '',
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: normalizeVolunteer(volunteer)
    });
  } catch (error) {
    console.error('Error creating volunteer application:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error submitting application' });
  }
};

// GET /api/volunteers (Admin)
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    const normalized = volunteers.map(v => normalizeVolunteer(v));
    res.json({ success: true, count: normalized.length, data: normalized });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error retrieving volunteers' });
  }
};

// GET /api/volunteers/:id (Admin)
const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }
    res.json({ success: true, data: normalizeVolunteer(volunteer) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/volunteers/:id (Admin - update status and/or admin notes)
const updateVolunteerStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateFields = {};

    if (status !== undefined) {
      let targetStatus = status;
      if (targetStatus === 'pending') targetStatus = 'New';
      if (targetStatus === 'accepted') targetStatus = 'Approved';

      if (!ALLOWED_STATUSES.includes(targetStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status "${status}". Allowed statuses are: ${ALLOWED_STATUSES.join(', ')}`
        });
      }
      updateFields.status = targetStatus;
    }

    if (adminNotes !== undefined) {
      updateFields.adminNotes = typeof adminNotes === 'string' ? adminNotes.trim() : '';
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No update fields provided (status or adminNotes)' });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }

    // Log admin audit
    if (updateFields.status) {
      await logAudit(
        req, 
        'UPDATE_STATUS', 
        'Volunteer', 
        volunteer._id, 
        `Updated volunteer status to "${updateFields.status}" for ${volunteer.name} (${volunteer.email})`
      );
    }
    if (updateFields.adminNotes !== undefined) {
      await logAudit(
        req, 
        'UPDATE_NOTES', 
        'Volunteer', 
        volunteer._id, 
        `Updated internal admin notes for ${volunteer.name}`
      );
    }

    res.json({
      success: true,
      message: 'Volunteer application updated successfully',
      data: normalizeVolunteer(volunteer)
    });
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update volunteer record' });
  }
};

// DELETE /api/volunteers/:id (Admin)
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found' });
    }

    await logAudit(
      req, 
      'DELETE', 
      'Volunteer', 
      volunteer._id, 
      `Deleted volunteer application for ${volunteer.name} (${volunteer.email})`
    );

    res.json({ success: true, message: 'Volunteer application deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete volunteer record' });
  }
};

module.exports = {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer,
  ALLOWED_STATUSES
};
