const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['donation', 'volunteer', 'enquiry', 'failed_payment', 'system'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
