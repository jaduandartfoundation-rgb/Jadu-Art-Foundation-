const Volunteer = require('../models/Volunteer');

// POST /api/volunteers
const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, city, interest, message } = req.body;
    if (!name || !email || !phone || !city || !interest) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }
    const volunteer = await Volunteer.create({ name, email, phone, city, interest, message });
    res.status(201).json({ success: true, message: 'Application submitted successfully', data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/volunteers (Admin)
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/volunteers/:id (Admin)
const updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createVolunteer,
  getVolunteers,
  updateVolunteerStatus
};
