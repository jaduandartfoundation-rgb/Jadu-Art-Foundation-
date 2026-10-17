const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  togglePublish,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getGalleryItems);

// Admin-protected
router.get('/all', protect, getAllGalleryItems);
router.post('/', protect, createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.patch('/:id/publish', protect, togglePublish);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
