const mongoose = require('mongoose');

const initiativeUpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  images: [{ type: String }],
  published: { type: Boolean, default: true }
}, { timestamps: true });

const donationInitiativeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hindiTitle: { type: String },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    default: 'General',
    required: true
  },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  targetAmount: { type: Number, required: true },
  manualAdjustment: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused', 'draft', 'archived'], 
    default: 'active' 
  },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  impactDescription: { type: String },
  location: { type: String, default: 'India' },
  startDate: { type: Date },
  endDate: { type: Date },
  updates: [initiativeUpdateSchema]
}, { timestamps: true });

module.exports = mongoose.model('DonationInitiative', donationInitiativeSchema);
