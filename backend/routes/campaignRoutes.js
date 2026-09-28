const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignBySlug,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.get('/', getCampaigns);
router.get('/:slug', getCampaignBySlug);
router.post('/', protect, createCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);

module.exports = router;
