const SiteContent = require('../models/SiteContent');
const { logAudit } = require('../utils/auditLogger');

// GET /api/content/:key (Public)
const getContentByKey = async (req, res) => {
  try {
    const content = await SiteContent.findOne({ key: req.params.key });
    res.json({ success: true, data: content ? content.data : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/content/:key (Admin)
const updateContentByKey = async (req, res) => {
  try {
    const { data } = req.body;
    const content = await SiteContent.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, data },
      { new: true, upsert: true }
    );

    await logAudit(req, 'UPDATED_SITE_CONTENT', 'Content', content._id, `Updated CMS section "${req.params.key}"`);
    res.json({ success: true, data: content.data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContentByKey,
  updateContentByKey
};
