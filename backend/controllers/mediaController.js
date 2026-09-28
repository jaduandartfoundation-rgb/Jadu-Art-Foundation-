const Media = require('../models/Media');
const SiteContent = require('../models/SiteContent');
const Work = require('../models/Work');
const DonationInitiative = require('../models/DonationInitiative');
const Story = require('../models/Story');
const GalleryItem = require('../models/GalleryItem');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const { generateSignature, cloudinary } = require('../config/cloudinary');
const { logAudit } = require('../utils/auditLogger');

/**
 * GET /api/media/signature
 * Returns signed parameters for Cloudinary direct upload.
 */
exports.getUploadSignature = async (req, res) => {
  try {
    const folder = req.query.folder || process.env.CLOUDINARY_FOLDER || 'jadu-art';
    const isConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    const sigData = generateSignature(folder);
    res.json({
      success: true,
      data: {
        ...sigData,
        isConfigured,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/media
 * Registers a newly uploaded Cloudinary image metadata in MongoDB.
 */
exports.createMedia = async (req, res) => {
  try {
    const {
      filename,
      originalFilename,
      cloudinaryPublicId,
      secureUrl,
      resourceType,
      format,
      width,
      height,
      bytes,
      folder,
      altText,
      caption,
    } = req.body;

    if (!cloudinaryPublicId || !secureUrl) {
      return res.status(400).json({
        success: false,
        message: 'cloudinaryPublicId and secureUrl are required',
      });
    }

    // Server-side validation check for file type & size
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    if (format && !allowedFormats.includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `File format .${format} is not allowed. Allowed: JPG, JPEG, PNG, WEBP.`,
      });
    }

    if (bytes && bytes > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds maximum limit of 5MB.',
      });
    }

    // Check if media asset already registered
    let media = await Media.findOne({ cloudinaryPublicId });
    if (media) {
      media.altText = altText !== undefined ? altText : media.altText;
      media.caption = caption !== undefined ? caption : media.caption;
      await media.save();
    } else {
      media = await Media.create({
        filename: filename || originalFilename || 'image',
        originalFilename: originalFilename || filename || 'image',
        cloudinaryPublicId,
        secureUrl,
        resourceType: resourceType || 'image',
        format: format || 'jpg',
        width: width || 0,
        height: height || 0,
        bytes: bytes || 0,
        folder: folder || process.env.CLOUDINARY_FOLDER || 'jadu-art',
        altText: altText || '',
        caption: caption || '',
        uploadedBy: req.user ? req.user._id : null,
      });
    }

    await logAudit(req, 'CREATE_MEDIA', 'Media', media._id, `Uploaded media: ${media.filename}`);

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/media
 * Query Media library with search, folder filter, and pagination.
 */
exports.getMediaLibrary = async (req, res) => {
  try {
    const { search, folder, page = 1, limit = 24 } = req.query;
    const query = {};

    if (folder) {
      query.folder = folder;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { filename: searchRegex },
        { originalFilename: searchRegex },
        { altText: searchRegex },
        { caption: searchRegex },
        { cloudinaryPublicId: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const total = await Media.countDocuments(query);
    const mediaList = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('uploadedBy', 'name email');

    res.json({
      success: true,
      data: mediaList,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Helper to check where a media URL / publicId is used across MongoDB collections.
 */
const findMediaUsageReferences = async (publicId, secureUrl) => {
  const references = [];
  const searchPattern = new RegExp(publicId || secureUrl, 'i');

  try {
    // 1. Check SiteContent
    const contents = await SiteContent.find({
      $or: [
        { 'data.heroImage': searchPattern },
        { 'data.whyWeExistImage': searchPattern },
      ],
    });
    contents.forEach((c) => {
      references.push({ collection: 'SiteContent', key: c.key, name: `Site Content (${c.key})` });
    });

    // 2. Check Work
    const works = await Work.find({
      $or: [
        { heroImage: searchPattern },
        { image: searchPattern },
        { gallery: searchPattern },
      ],
    });
    works.forEach((w) => {
      references.push({ collection: 'Work', id: w._id, name: `Work: ${w.title}` });
    });

    // 3. Check DonationInitiative
    const initiatives = await DonationInitiative.find({
      $or: [
        { image: searchPattern },
        { 'updates.image': searchPattern },
      ],
    });
    initiatives.forEach((i) => {
      references.push({ collection: 'DonationInitiative', id: i._id, name: `Initiative: ${i.title}` });
    });

    // 4. Check Story
    const stories = await Story.find({
      $or: [
        { heroImage: searchPattern },
        { image: searchPattern },
        { gallery: searchPattern },
      ],
    });
    stories.forEach((s) => {
      references.push({ collection: 'Story', id: s._id, name: `Story: ${s.title}` });
    });

    // 5. Check GalleryItem
    const galleryItems = await GalleryItem.find({ imageUrl: searchPattern });
    galleryItems.forEach((g) => {
      references.push({ collection: 'GalleryItem', id: g._id, name: `Gallery Item: ${g.title || 'Untitled'}` });
    });

    // 6. Check TeamMember
    const teamMembers = await TeamMember.find({ image: searchPattern });
    teamMembers.forEach((t) => {
      references.push({ collection: 'TeamMember', id: t._id, name: `Team Member: ${t.name}` });
    });

    // 7. Check Testimonial
    const testimonials = await Testimonial.find({ image: searchPattern });
    testimonials.forEach((tm) => {
      references.push({ collection: 'Testimonial', id: tm._id, name: `Testimonial: ${tm.name}` });
    });
  } catch (err) {
    console.error('Error calculating media usage:', err);
  }

  return references;
};

/**
 * GET /api/media/:id/usage
 * Check usage references for a media item.
 */
exports.getMediaUsage = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    const usages = await findMediaUsageReferences(media.cloudinaryPublicId, media.secureUrl);
    res.json({
      success: true,
      data: {
        media,
        usages,
        usageCount: usages.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/media/:id
 * Update Alt Text & Caption metadata.
 */
exports.updateMedia = async (req, res) => {
  try {
    const { altText, caption, filename } = req.body;
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    if (altText !== undefined) media.altText = altText;
    if (caption !== undefined) media.caption = caption;
    if (filename !== undefined) media.filename = filename;

    await media.save();
    await logAudit(req, 'UPDATE_MEDIA', 'Media', media._id, `Updated metadata for ${media.filename}`);

    res.json({ success: true, data: media });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/media/:id
 * Delete media asset from MongoDB and Cloudinary (if not referenced elsewhere).
 */
exports.deleteMedia = async (req, res) => {
  try {
    const { forceDelete } = req.query;
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media asset not found' });
    }

    // Check usages
    const usages = await findMediaUsageReferences(media.cloudinaryPublicId, media.secureUrl);

    if (usages.length > 0 && forceDelete !== 'true') {
      return res.status(409).json({
        success: false,
        message: `This image is currently being used in ${usages.length} place(s).`,
        data: {
          usages,
          usageCount: usages.length,
        },
      });
    }

    // Attempt deletion from Cloudinary
    if (process.env.CLOUDINARY_API_SECRET && media.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryPublicId);
      } catch (cErr) {
        console.error('Cloudinary destroy error:', cErr.message);
      }
    }

    // Remove from MongoDB
    await Media.findByIdAndDelete(req.params.id);
    await logAudit(req, 'DELETE_MEDIA', 'Media', media._id, `Deleted media ${media.filename}`);

    res.json({
      success: true,
      message: 'Media asset deleted successfully',
      data: { id: media._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
