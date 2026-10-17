const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  // ── Media type ──────────────────────────────────────────────
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },

  // ── Legacy / Image fields (preserved for backward compat) ───
  image: { type: String },           // legacy field – keep as-is for old records

  // ── Unified URL fields ───────────────────────────────────────
  mediaUrl: { type: String },        // primary URL (image src or video src)
  thumbnailUrl: { type: String },    // poster image for videos; thumbnail for images

  // ── Cloudinary tracking ──────────────────────────────────────
  cloudinaryPublicId: { type: String },
  thumbnailPublicId: { type: String },

  // ── Metadata ─────────────────────────────────────────────────
  title: { type: String, trim: true },
  caption: { type: String, trim: true },
  description: { type: String, trim: true },
  altText: { type: String, trim: true },
  category: { type: String, trim: true },

  // ── Video-specific ───────────────────────────────────────────
  videoSource: {
    type: String,
    enum: ['upload', 'url'],
    default: 'upload',
  },
  externalUrl: { type: String, trim: true },  // for externally hosted videos (YouTube / Vimeo / direct)

  // ── Publishing ───────────────────────────────────────────────
  published: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },

}, { timestamps: true });

// Virtual: resolve the effective display URL (supports legacy `image` field)
galleryItemSchema.virtual('effectiveImageUrl').get(function () {
  return this.mediaUrl || this.image || '';
});

// Virtual: ensure legacy records are treated as images
galleryItemSchema.virtual('resolvedMediaType').get(function () {
  return this.mediaType || 'image';
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
