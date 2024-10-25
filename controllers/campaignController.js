const Campaign = require('../models/campaign.model');
const Lead = require('../models/lead.model');
const Metric = require('../models/metric.model');

const getCampaigns = async (req, res) => {
  try {
    // Fetch all campaigns from the database
    const campaigns = await Campaign.find();
    
    // If no campaigns found, return a 404 response
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: 'No campaigns found' });
    }

    // Return the campaigns in the response
    res.status(200).json(campaigns);
  } catch (err) {
    // Log the error and return a 500 response with error details
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ message: 'Error fetching campaigns', error: err.message });
  }
};

// Create a new campaign
const saveCampaigns = async (req, res) => {
  try {
    const { name, spent, budget, startDate, endDate, channel, campaignType } = req.body;
    if (!name || !spent || !budget || !startDate || !endDate || !channel || !campaignType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Create a new campaign
    const newCampaign = new Campaign({ name, spent, budget, startDate, endDate, channel, campaignType });
    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Error creating campaign' });
  }
};



module.exports = { getCampaigns, saveCampaigns };
