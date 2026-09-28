const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/signature', mediaController.getUploadSignature);
router.post('/', mediaController.createMedia);
router.get('/', mediaController.getMediaLibrary);
router.get('/:id/usage', mediaController.getMediaUsage);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
