const mongoose = require('mongoose');

const donationSettingsSchema = new mongoose.Schema({
  // 1. Bank Details
  bankDetails: {
    accountHolder: { type: String, default: 'Jadu and Art Foundation' },
    bankName: { type: String, default: 'Punjab National Bank' },
    accountNumber: { type: String, default: '1896102100000714' },
    ifsc: { type: String, default: 'PUNB0189610' },
    branch: { type: String, default: 'Janjgir (Janjgir - Champa)' },
    verificationStatus: { 
      type: String, 
      enum: ['Draft', 'Awaiting Verification', 'Verified', 'Published'], 
      default: 'Awaiting Verification' 
    },
    verifiedBy: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
      name: { type: String },
      email: { type: String }
    },
    verifiedAt: { type: Date },
    verificationNotes: { type: String, default: '' }
  },

  // 2. UPI & QR Details
  upiDetails: {
    // Supplied initial value: '79875 57650m3@pnb' (unverified because text contains space)
    upiId: { type: String, default: '79875 57650m3@pnb' },
    recipientName: { type: String, default: 'JADU AND ART FOUNDATION' },
    verificationStatus: { 
      type: String, 
      enum: ['Draft', 'Awaiting Verification', 'Verified', 'Published'], 
      default: 'Awaiting Verification' 
    },
    verifiedBy: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
      name: { type: String },
      email: { type: String }
    },
    verifiedAt: { type: Date },
    verificationNotes: { type: String, default: '' }
  },

  qrDetails: {
    qrImageUrl: { 
      type: String, 
      default: 'https://res.cloudinary.com/urnn2fkr/image/upload/v1792096134/jadu-art/donations/iyiqks043w9he0q6exse.jpg' 
    },
    localFallbackUrl: { type: String, default: '/official-pnb-qr.jpg' },
    verificationStatus: { 
      type: String, 
      enum: ['Draft', 'Awaiting Verification', 'Verified', 'Published'], 
      default: 'Verified' 
    },
    verifiedBy: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
      name: { type: String, default: 'Official Bank Issue' },
      email: { type: String, default: 'jaduandartfoundation@gmail.com' }
    },
    verifiedAt: { type: Date, default: Date.now },
    verificationNotes: { type: String, default: 'Official Punjab National Bank merchant QR issued to JADU AND ART FOUNDATION' }
  },

  // 3. Support Contact Information
  supportContact: {
    phone: { type: String, default: '95896 21753' },
    whatsapp: { type: String, default: '95896 21753' },
    email: { type: String, default: 'jaduandartfoundation@gmail.com' }
  },

  // 4. Methods Enabled & Gateway
  methodsEnabled: {
    upi: { type: Boolean, default: true },
    bankTransfer: { type: Boolean, default: true },
    razorpay: { type: Boolean, default: false },
    razorpayStatus: { 
      type: String, 
      enum: ['disabled', 'pending_activation', 'active'], 
      default: 'pending_activation' 
    },
    razorpayKeyId: { type: String, default: '' }
  },

  // 5. Headings, Instructions & Transparency
  headingEnglish: { type: String, default: 'SUPPORT OUR MISSION' },
  headingHindi: { type: String, default: 'आपका सहयोग, किसी के जीवन में बदलाव' },
  description: { 
    type: String, 
    default: 'Your contribution can support our efforts towards education, healthcare, cow welfare and humanitarian relief. Choose a donation method below.' 
  },
  transparencyMessage: { 
    type: String, 
    default: 'Submitting this form does not automatically confirm that your payment has been received. The foundation will verify the transaction against its bank records.' 
  },
  acknowledgementTemplate: {
    type: String,
    default: 'Thank you for your generous contribution to Jadu & Art Foundation. Your voluntary contribution has been verified against our Punjab National Bank records.'
  },

  // 6. Audit Trail for Settings
  history: [{
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String },
    action: { type: String },
    details: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('DonationSettings', donationSettingsSchema);
