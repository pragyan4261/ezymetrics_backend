const Lead = require('../models/lead.model');
const Campaign = require('../models/campaign.model');
const Metric = require('../models/metric.model');
const nodemailer = require('nodemailer');


// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Fetch dummy lead data
const getLeads = (req, res) => {
  const leads = [
    { id: 1, name: 'Lead 1', email: 'lead1@example.com', status: 'new' },
    { id: 2, name: 'Lead 2', email: 'lead2@example.com', status: 'contacted' }
  ];
  res.json(leads);
};

  
// Save leads to the database
const saveLeads = async (req, res) => {
  try {
    const { name, email, phone, source, status, campaignId, notes } = req.body;

    // Create a new lead object
    const newLead = new Lead({
      name,
      email,
      phone,
      source,
      status,
      campaignId,
      notes
    });

    // Save the lead to the database
    await newLead.save();
    res.status(201).json({ message: 'Lead saved successfully!', lead: newLead });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ message: 'Failed to save lead', error: err });
  }
};

module.exports = { getLeads, saveLeads };
