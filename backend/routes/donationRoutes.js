const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  verifyPayment, 
  getDonations, 
  getDonationById, 
  getDonationReports, 
  exportDonationsCSV 
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Admin protected routes
router.get('/', protect, getDonations);
router.get('/reports', protect, getDonationReports);
router.get('/export', protect, exportDonationsCSV);
router.get('/:id', protect, getDonationById);

module.exports = router;
