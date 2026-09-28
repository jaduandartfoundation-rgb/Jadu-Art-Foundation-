const Document = require('../models/Document');
const { logAudit } = require('../utils/auditLogger');

// GET /api/documents (Public - Published documents)
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/documents/admin/all (Admin - All documents)
const getAllDocumentsAdmin = async (req, res) => {
  try {
    const docs = await Document.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/documents (Admin)
const createDocument = async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    await logAudit(req, 'CREATED_DOCUMENT', 'Document', doc._id, `Added compliance document "${doc.name}"`);
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/documents/:id (Admin)
const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    await logAudit(req, 'UPDATED_DOCUMENT', 'Document', doc._id, `Updated document "${doc.name}"`);
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/documents/:id (Admin)
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    await logAudit(req, 'DELETED_DOCUMENT', 'Document', doc._id, `Deleted document "${doc.name}"`);
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDocuments,
  getAllDocumentsAdmin,
  createDocument,
  updateDocument,
  deleteDocument
};
