const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: { type: String },
  amount: { type: Number, required: true },
  campaign: { type: String, required: true },
  initiativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationInitiative' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
