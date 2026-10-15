const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { 
  getPublicDonationConfig, 
  getAdminDonationSettings, 
  updateDonationSettings, 
  verifyDonationGate 
} = require('../controllers/donationSettingsController');
const { protect } = require('../middleware/auth');

// General Site Settings
router.get('/', getSettings);
router.put('/', protect, updateSettings);

// Donation Settings CMS & Verification Gate
router.get('/donation-public', getPublicDonationConfig);
router.get('/donation-settings', protect, getAdminDonationSettings);
router.put('/donation-settings', protect, updateDonationSettings);
router.patch('/donation-settings/verify-gate', protect, verifyDonationGate);

module.exports = router;
