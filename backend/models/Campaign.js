const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['education', 'healthcare', 'cow-welfare', 'disaster-relief', 'general'],
    required: true
  },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  targetAmount: { type: Number },
  status: { type: String, enum: ['active', 'completed', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
