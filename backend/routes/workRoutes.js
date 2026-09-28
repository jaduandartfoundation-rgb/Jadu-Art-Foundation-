const express = require('express');
const router = express.Router();
const { 
  getWorks, 
  getWorkCategories, 
  getWorkBySlug, 
  getAllWorksAdmin, 
  createWork, 
  updateWork, 
  deleteWork,
  createWorkCategory
} = require('../controllers/workController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getWorks);
router.get('/categories', getWorkCategories);
router.get('/admin/all', protect, getAllWorksAdmin);
router.get('/:slug', getWorkBySlug);

// Admin routes
router.post('/', protect, createWork);
router.put('/:id', protect, updateWork);
router.delete('/:id', protect, deleteWork);
router.post('/categories', protect, createWorkCategory);

module.exports = router;
