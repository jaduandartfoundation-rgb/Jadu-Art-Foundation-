const GalleryItem = require('../models/GalleryItem');
const { cloudinary } = require('../config/cloudinary');
const { logAudit } = require('../utils/auditLogger');

/**
 * Sanitise a string field – trims and strips any HTML tags.
 */
const sanitise = (val) =>
  typeof val === 'string' ? val.trim().replace(/<[^>]*>/g, '') : val;

/**
 * Validate an externally hosted video URL.
 * Allows YouTube, Vimeo, or direct video file URLs (mp4/webm/ogg).
 */
const validateVideoUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const allowedHosts = ['youtube.com', 'youtu.be', 'vimeo.com'];
    const allowedExt = /\.(mp4|webm|ogg|mov)$/i;
    return allowedHosts.includes(hostname) || allowedExt.test(parsed.pathname);
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────
// PUBLIC: GET /api/gallery  (published items only)
// ─────────────────────────────────────────────────────────────
const getGalleryItems = async (req, res) => {
  try {
    const { category, mediaType } = req.query;
    const filter = { published: true };
    if (category && category !== 'all') filter.category = category;
    if (mediaType && mediaType !== 'all') filter.mediaType = mediaType;

    const items = await GalleryItem.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 });

    // Normalise legacy records that only have `image` field
    const normalised = items.map(normaliseItem);
    res.json({ success: true, data: normalised });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: GET /api/gallery/all  (all items)
// ─────────────────────────────────────────────────────────────
const getAllGalleryItems = async (req, res) => {
  try {
    const { category, mediaType } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (mediaType && mediaType !== 'all') filter.mediaType = mediaType;

    const items = await GalleryItem.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, data: items.map(normaliseItem) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: POST /api/gallery  (create image or video item)
// ─────────────────────────────────────────────────────────────
const createGalleryItem = async (req, res) => {
  try {
    const {
      mediaType = 'image',
      mediaUrl,
      thumbnailUrl,
      cloudinaryPublicId,
      thumbnailPublicId,
      title,
      caption,
      description,
      altText,
      category,
      videoSource,
      externalUrl,
      published = false,
      displayOrder = 0,
      // legacy field support
      image,
      imageUrl,
    } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (mediaType === 'video') {
      if (videoSource === 'url') {
        if (!externalUrl) {
          return res.status(400).json({ success: false, message: 'External video URL is required.' });
        }
        if (!validateVideoUrl(externalUrl)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid video URL. Only YouTube, Vimeo, or direct MP4/WebM links are allowed.',
          });
        }
      } else {
        const videoFileUrl = mediaUrl || imageUrl;
        if (!videoFileUrl) {
          return res.status(400).json({ success: false, message: 'Video URL is required.' });
        }
      }
    } else {
      // Image validation
      const imgUrl = mediaUrl || imageUrl || image;
      if (!imgUrl) {
        return res.status(400).json({ success: false, message: 'Image URL is required.' });
      }
    }

    // ── Build document ───────────────────────────────────────
    const resolvedMediaUrl = mediaUrl || imageUrl || image || externalUrl;

    const doc = {
      mediaType,
      mediaUrl: sanitise(resolvedMediaUrl),
      thumbnailUrl: sanitise(thumbnailUrl),
      cloudinaryPublicId: sanitise(cloudinaryPublicId),
      thumbnailPublicId: sanitise(thumbnailPublicId),
      title: sanitise(title),
      caption: sanitise(caption),
      description: sanitise(description),
      altText: sanitise(altText),
      category: sanitise(category),
      videoSource: mediaType === 'video' ? (videoSource || 'upload') : undefined,
      externalUrl: mediaType === 'video' && videoSource === 'url' ? sanitise(externalUrl) : undefined,
      published: Boolean(published),
      displayOrder: Number(displayOrder) || 0,
      // preserve legacy field if it came in
      image: mediaType === 'image' ? sanitise(image || mediaUrl || imageUrl) : undefined,
    };

    const item = await GalleryItem.create(doc);
    await logAudit(req, 'CREATE_GALLERY_ITEM', 'GalleryItem', item._id,
      `Created ${mediaType} gallery item: ${item.title || item._id}`);

    res.status(201).json({ success: true, data: normaliseItem(item) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: PUT /api/gallery/:id  (update an item)
// ─────────────────────────────────────────────────────────────
const updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const allowedFields = [
      'title', 'caption', 'description', 'altText', 'category',
      'mediaUrl', 'thumbnailUrl', 'cloudinaryPublicId', 'thumbnailPublicId',
      'videoSource', 'externalUrl', 'published', 'displayOrder', 'image',
    ];

    // Validate externalUrl if changing to url source
    if (req.body.videoSource === 'url' && req.body.externalUrl) {
      if (!validateVideoUrl(req.body.externalUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid video URL. Only YouTube, Vimeo, or direct MP4/WebM links are allowed.',
        });
      }
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = typeof req.body[field] === 'string'
          ? sanitise(req.body[field])
          : req.body[field];
      }
    });

    await item.save();
    await logAudit(req, 'UPDATE_GALLERY_ITEM', 'GalleryItem', item._id,
      `Updated gallery item: ${item.title || item._id}`);

    res.json({ success: true, data: normaliseItem(item) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: PATCH /api/gallery/:id/publish  (toggle publish)
// ─────────────────────────────────────────────────────────────
const togglePublish = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    item.published = !item.published;
    await item.save();
    await logAudit(req, item.published ? 'PUBLISH_GALLERY_ITEM' : 'UNPUBLISH_GALLERY_ITEM',
      'GalleryItem', item._id, `${item.published ? 'Published' : 'Unpublished'} gallery item: ${item.title || item._id}`);

    res.json({ success: true, data: normaliseItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: DELETE /api/gallery/:id
// ─────────────────────────────────────────────────────────────
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    // Attempt to delete asset(s) from Cloudinary if publicId is known
    if (process.env.CLOUDINARY_API_SECRET) {
      const deleteAsset = async (publicId, resourceType = 'image') => {
        if (!publicId) return;
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (cErr) {
          console.error(`Cloudinary destroy error for ${publicId}:`, cErr.message);
        }
      };

      const resourceType = item.mediaType === 'video' ? 'video' : 'image';
      await deleteAsset(item.cloudinaryPublicId, resourceType);
      if (item.thumbnailPublicId) await deleteAsset(item.thumbnailPublicId, 'image');
    }

    await GalleryItem.findByIdAndDelete(req.params.id);
    await logAudit(req, 'DELETE_GALLERY_ITEM', 'GalleryItem', item._id,
      `Deleted gallery item: ${item.title || item._id}`);

    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Helper: normalise a Mongoose document for consistent API shape
// ─────────────────────────────────────────────────────────────
const normaliseItem = (item) => {
  const obj = item.toObject ? item.toObject() : item;

  // Back-compat: if mediaType missing, treat as image
  if (!obj.mediaType) obj.mediaType = 'image';

  // Back-compat: if mediaUrl missing, fall back to legacy `image` field
  if (!obj.mediaUrl && obj.image) obj.mediaUrl = obj.image;

  // Ensure title falls back to caption for legacy image records
  if (!obj.title && obj.caption) obj.title = obj.caption;

  return obj;
};

module.exports = {
  getGalleryItems,
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  togglePublish,
  deleteGalleryItem,
};
