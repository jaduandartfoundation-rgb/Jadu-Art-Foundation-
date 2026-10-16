const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  interest: { type: String, required: true, trim: true },
  message: { type: String, default: '' },
  skills: { type: String, default: '' },
  availability: { type: String, default: '' },
  adminNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'New',
      'Contacted',
      'Under Review',
      'Approved',
      'Joined',
      'On Hold',
      'Rejected',
      'Inactive',
      'pending',
      'accepted'
    ],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
