const express = require('express');
const router = express.Router();
const { 
  getTeamMembers, 
  getAllTeamMembersAdmin, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

router.get('/', getTeamMembers);
router.get('/all', protect, getAllTeamMembersAdmin);
router.post('/', protect, createTeamMember);
router.put('/:id', protect, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;
