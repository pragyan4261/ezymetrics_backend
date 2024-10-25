const Metric = require('../models/metric.model');

const getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find({});
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error });
  }
};

module.exports = { getMetrics };
