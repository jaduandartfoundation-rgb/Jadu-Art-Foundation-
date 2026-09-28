const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true },
  adminName: { type: String },
  action: { type: String, required: true }, // e.g. 'CREATED_WORK', 'UPDATED_HOMEPAGE', 'DELETED_GALLERY_ITEM'
  module: { type: String, required: true }, // e.g. 'Work', 'Homepage', 'Gallery', 'Donations'
  recordId: { type: String },
  details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
