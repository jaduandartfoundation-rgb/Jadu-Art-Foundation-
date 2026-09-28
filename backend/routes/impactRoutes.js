const express = require('express');
const router = express.Router();
const {
  getImpactMetrics,
  getAllImpactMetrics,
  createImpactMetric,
  updateImpactMetric,
  deleteImpactMetric
} = require('../controllers/impactController');
const { protect } = require('../middleware/auth');

router.get('/', getImpactMetrics);
router.get('/all', protect, getAllImpactMetrics);
router.post('/', protect, createImpactMetric);
router.put('/:id', protect, updateImpactMetric);
router.delete('/:id', protect, deleteImpactMetric);

module.exports = router;
