const express = require('express');
const router = express.Router();
const { getContentByKey, updateContentByKey } = require('../controllers/siteContentController');
const { protect } = require('../middleware/auth');

router.get('/:key', getContentByKey);
router.put('/:key', protect, updateContentByKey);

module.exports = router;
