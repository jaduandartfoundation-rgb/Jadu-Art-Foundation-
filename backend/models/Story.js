const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  category: { type: String },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
