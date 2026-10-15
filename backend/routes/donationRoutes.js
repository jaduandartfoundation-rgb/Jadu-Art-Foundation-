const express = require('express');
const router = express.Router();
const { 
  confirmDirectDonation,
  createOrder, 
  verifyPayment, 
  getDonations, 
  getDonationById, 
  verifyDonation,
  recordAcknowledgement,
  getDonationReports, 
  exportDonationsCSV 
} = require('../controllers/donationController');
const { getPublicDonationConfig } = require('../controllers/donationSettingsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/public-config', getPublicDonationConfig);
router.post('/confirm', confirmDirectDonation);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Admin protected routes
router.get('/', protect, getDonations);
router.get('/reports', protect, getDonationReports);
router.get('/export', protect, exportDonationsCSV);
router.get('/:id', protect, getDonationById);
router.patch('/:id/verify', protect, verifyDonation);
router.patch('/:id/acknowledgement', protect, recordAcknowledgement);

module.exports = router;
