const express = require('express');
const router = express.Router();
const {
  createVolunteer,
  getVolunteers,
  updateVolunteerStatus
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

router.post('/', createVolunteer);
router.get('/', protect, getVolunteers);
router.patch('/:id', protect, updateVolunteerStatus);

module.exports = router;
