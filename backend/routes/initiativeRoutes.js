const express = require('express');
const router = express.Router();
const { 
  getInitiatives, 
  getFeaturedInitiatives, 
  getAllInitiativesAdmin, 
  getInitiativeBySlug, 
  createInitiative, 
  updateInitiative, 
  deleteInitiative,
  addInitiativeUpdate,
  deleteInitiativeUpdate
} = require('../controllers/initiativeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getInitiatives);
router.get('/featured', getFeaturedInitiatives);
router.get('/all', protect, getAllInitiativesAdmin);
router.get('/:slug', getInitiativeBySlug);

// Admin only routes
router.post('/', protect, createInitiative);
router.patch('/:id', protect, updateInitiative);
router.put('/:id', protect, updateInitiative);
router.delete('/:id', protect, deleteInitiative);
router.post('/:id/updates', protect, addInitiativeUpdate);
router.delete('/:id/updates/:updateId', protect, deleteInitiativeUpdate);

module.exports = router;
