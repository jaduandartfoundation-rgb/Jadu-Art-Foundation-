const mongoose = require('mongoose');

const impactMetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ImpactMetric', impactMetricSchema);
