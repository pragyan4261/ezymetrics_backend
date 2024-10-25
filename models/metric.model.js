// models/Metric.js

const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  totalLeads: Number,
  convertedLeads: Number,
  conversionRate: Number,
  campaignId: mongoose.Schema.Types.ObjectId,
  campaignName: String,
  leadValue: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Metric', metricSchema);
