const express = require('express');
const router = express.Router();
const { 
  getDocuments, 
  getAllDocumentsAdmin, 
  createDocument, 
  updateDocument, 
  deleteDocument 
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

router.get('/', getDocuments);
router.get('/all', protect, getAllDocumentsAdmin);
router.post('/', protect, createDocument);
router.put('/:id', protect, updateDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
