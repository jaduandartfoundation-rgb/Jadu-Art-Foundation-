const ImpactMetric = require('../models/ImpactMetric');

// GET /api/impact
const getImpactMetrics = async (req, res) => {
  try {
    const metrics = await ImpactMetric.find({ published: true }).sort({ order: 1 });
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/impact/all (Admin)
const getAllImpactMetrics = async (req, res) => {
  try {
    const metrics = await ImpactMetric.find().sort({ order: 1 });
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/impact (Admin)
const createImpactMetric = async (req, res) => {
  try {
    const metric = await ImpactMetric.create(req.body);
    res.status(201).json({ success: true, data: metric });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/impact/:id (Admin)
const updateImpactMetric = async (req, res) => {
  try {
    const metric = await ImpactMetric.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!metric) {
      return res.status(404).json({ success: false, message: 'Metric not found' });
    }
    res.json({ success: true, data: metric });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/impact/:id (Admin)
const deleteImpactMetric = async (req, res) => {
  try {
    const metric = await ImpactMetric.findByIdAndDelete(req.params.id);
    if (!metric) {
      return res.status(404).json({ success: false, message: 'Metric not found' });
    }
    res.json({ success: true, message: 'Metric deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getImpactMetrics,
  getAllImpactMetrics,
  createImpactMetric,
  updateImpactMetric,
  deleteImpactMetric
};
