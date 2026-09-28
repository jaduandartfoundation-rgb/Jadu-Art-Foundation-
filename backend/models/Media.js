const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    secureUrl: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      default: 'image',
    },
    format: {
      type: String,
      trim: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    bytes: {
      type: Number,
      default: 0,
    },
    folder: {
      type: String,
      default: 'jadu-art',
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
  },
  { timestamps: true }
);

mediaSchema.index({ filename: 'text', altText: 'text', caption: 'text', cloudinaryPublicId: 'text' });

module.exports = mongoose.model('Media', mediaSchema);
