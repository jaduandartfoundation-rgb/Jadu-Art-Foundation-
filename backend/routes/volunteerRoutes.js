const express = require('express');
const router = express.Router();
const {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

// Public route: Volunteer application submission
router.post('/', createVolunteer);

// Protected Admin routes
router.get('/', protect, getVolunteers);
router.get('/:id', protect, getVolunteerById);
router.patch('/:id', protect, updateVolunteerStatus);
router.delete('/:id', protect, deleteVolunteer);

module.exports = router;
