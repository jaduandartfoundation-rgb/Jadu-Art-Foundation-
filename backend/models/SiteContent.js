const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'homepage', 'about', 'contact', 'footer', 'seo', 'section_visibility'
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
