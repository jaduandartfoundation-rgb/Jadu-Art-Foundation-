const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getAllGalleryItems,
  createGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

router.get('/', getGalleryItems);
router.get('/all', protect, getAllGalleryItems);
router.post('/', protect, createGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
