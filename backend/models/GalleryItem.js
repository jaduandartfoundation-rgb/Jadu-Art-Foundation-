const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String },
  category: { type: String },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
