const express = require('express');
const router = express.Router();
const {
  getStories,
  getAllStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.get('/', getStories);
router.get('/all', protect, getAllStories);
router.get('/:slug', getStoryBySlug);
router.post('/', protect, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);

module.exports = router;
