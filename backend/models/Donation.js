const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: '' },
  pan: { type: String, trim: true, uppercase: true, default: '' },
  amount: { type: Number, required: true, min: 1 },
  campaign: { type: String, default: 'General Support' },
  initiativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationInitiative' },
  
  // Direct Payment / Confirmation Details
  paymentType: { 
    type: String, 
    enum: ['direct_transfer', 'upi_qr', 'gateway'], 
    default: 'direct_transfer' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'NEFT', 'IMPS', 'Other', 'Card', 'NetBanking', 'Cashfree', 'Razorpay'], 
    default: 'UPI' 
  },
  transactionRef: { 
    type: String, 
    trim: true,
    index: true,
    default: '' 
  }, // UTR / Reference number
  paymentDate: { type: Date, default: Date.now },
  donorMessage: { type: String, trim: true, default: '' },

  // Verification Lifecycle
  status: { 
    type: String, 
    enum: ['pending', 'pending_verification', 'verified', 'rejected', 'success', 'failed'], 
    default: 'pending_verification',
    index: true 
  },
  adminNotes: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  verifiedBy: {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    adminName: { type: String },
    adminEmail: { type: String }
  },
  verifiedAt: { type: Date },

  // Acknowledgement tracking (non-80G donation acknowledgement receipt)
  acknowledgementSent: { type: Boolean, default: false },
  acknowledgementSentAt: { type: Date },
  acknowledgementSentBy: { type: String },
  acknowledgementNotes: { type: String, default: '' },

  // Security & Audit
  ipAddress: { type: String, default: '' },

  // Payment Gateway fields (Cashfree / Razorpay for backwards compatibility)
  cashfreeOrderId: { type: String },
  cashfreePaymentId: { type: String },
  cashfreeSessionId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
