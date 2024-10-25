const Lead = require('../models/lead.model');
const Campaign = require('../models/campaign.model');
const Metric = require('../models/metric.model');

const performETL = async () => {
  try {
    console.log('ETL process started.');

    const leads = await Lead.find({});
    const campaigns = await Campaign.find({});

    for (let campaign of campaigns) {
      // Filter leads for the current campaign
      const leadsForCampaign = leads.filter(lead => lead.campaignId && lead.campaignId.toString() === campaign._id.toString());

      const totalLeads = leadsForCampaign.length;
      const convertedLeads = leadsForCampaign.filter(lead => lead.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      const leadValue = totalLeads > 0 ? campaign.budget / totalLeads : 0;

      const metric = new Metric({
        totalLeads,
        convertedLeads,
        conversionRate,
        campaignId: campaign._id,
        campaignName: campaign.name,
        leadValue,
      });

      await metric.save();
    }

    console.log('ETL process completed.');
  } catch (error) {
    console.error('Error during ETL process:', error);
  }
};

module.exports = { performETL };
