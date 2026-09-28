const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hindiName: { type: String },
  description: { type: String },
  fileUrl: { type: String, required: true },
  docType: { 
    type: String, 
    enum: ['Registration', '12A', '80G', 'PAN', 'Annual Report', 'Financial Report', 'Other'],
    default: 'Other'
  },
  year: { type: String, default: '2026' },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
