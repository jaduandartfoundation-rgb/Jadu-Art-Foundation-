const Testimonial = require('../models/Testimonial');
const { logAudit } = require('../utils/auditLogger');

// GET /api/testimonials (Public)
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/testimonials/admin/all (Admin)
const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/testimonials (Admin)
const createTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.create(req.body);
    await logAudit(req, 'CREATED_TESTIMONIAL', 'Testimonial', item._id, `Added testimonial by "${item.name}"`);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/testimonials/:id (Admin)
const updateTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await logAudit(req, 'UPDATED_TESTIMONIAL', 'Testimonial', item._id, `Updated testimonial by "${item.name}"`);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/testimonials/:id (Admin)
const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await logAudit(req, 'DELETED_TESTIMONIAL', 'Testimonial', item._id, `Deleted testimonial by "${item.name}"`);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
