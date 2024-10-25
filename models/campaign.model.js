const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  spent: { type: Number, required: true },
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  channel: { type: String, required: true },
  campaignType: { type: String, required: true },

});

module.exports = mongoose.model('Campaign', campaignSchema);
