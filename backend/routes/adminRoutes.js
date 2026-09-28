const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAdminUsers, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser, 
  getAuditLogs 
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getAdminStats);
router.get('/audit-logs', protect, getAuditLogs);

// Admin User Management
router.get('/users', protect, getAdminUsers);
router.post('/users', protect, createAdminUser);
router.put('/users/:id', protect, updateAdminUser);
router.delete('/users/:id', protect, deleteAdminUser);

module.exports = router;
