const mongoose = require('mongoose');

const workCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hindiName: { type: String },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hindiTitle: { type: String },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  image: { type: String },
  icon: { type: String, default: 'BookOpen' },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false } // Soft deletion
}, { timestamps: true });

const Work = mongoose.model('Work', workSchema);
const WorkCategory = mongoose.model('WorkCategory', workCategorySchema);

module.exports = { Work, WorkCategory };
