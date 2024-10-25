const Campaign = require('../models/campaign.model');
const nodemailer = require('nodemailer');

// Set up your email transporter using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'useremail', // Your Gmail address
    pass: 'yourgmailpass', // Gmail app-specific password
  },
});

// Function to send notification email
const sendNotificationEmail = async (campaign) => {
  const mailOptions = {
    from: '"EzyMetrics" <sender@email.com>',
    to: 'recipient@email.com', // List of recipients for testing
    subject: `Campaign Alert: ${campaign.name}`,
    text: `Campaign "${campaign.name}" has triggered an alert.\n\n` +
          `Budget Utilization: ${campaign.budgetUtilization}%\n` +
          `End Date: ${campaign.endDate}\n\n` +
          `Please review the campaign for further actions.`,
    html: `<p>Campaign "<strong>${campaign.name}</strong>" has triggered an alert.</p>` +
          `<p>Budget Utilization: <strong>${campaign.budgetUtilization}%</strong></p>` +
          `<p>End Date: <strong>${campaign.endDate}</strong></p>` +
          `<p>Please review the campaign for further actions.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};

// Function to check campaign metrics and send notifications
const checkCampaignMetrics = async () => {
  try {
    const campaigns = await Campaign.find(); // Fetch all campaigns

    campaigns.forEach(campaign => {
      // Calculate budget utilization
      const budgetUtilization = ((campaign.spent / campaign.budget) * 100).toFixed(2);
      campaign.budgetUtilization = budgetUtilization; // Add calculated value to campaign object

      // Condition: If budget utilization exceeds 90%
      if (budgetUtilization > 90) {
        sendNotificationEmail(campaign);
      }

      // Condition: If the campaign end date is within a week and performance metrics are not met
      const endDate = new Date(campaign.endDate);
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 3600 * 24));
      if (daysLeft <= 7 && campaign.status === 'active' && campaign.conversions < 10) {
        sendNotificationEmail(campaign);
      }
    });
  } catch (error) {
    console.error('Error checking campaign metrics:', error);
  }
};

// Call this function to trigger the email notification for testing purposes

const testEmailNotification = async () => {
  try {
    // Fetch all campaigns from MongoDB
    const campaigns = await Campaign.find();

    if (!campaigns || campaigns.length === 0) {
      console.log('No campaigns found');
      return;
    }

    // Map through each campaign and send email notification if conditions are met
    campaigns.map(async (campaign) => {
      // Calculate budget utilization
      campaign.budgetUtilization = ((campaign.spent / campaign.budget) * 100).toFixed(2);

      // Condition 1: Send email if budget utilization exceeds 90%
      if (campaign.budgetUtilization > 70) {
        await sendNotificationEmail(campaign);
      }

      // Condition 2: Send email if the campaign end date is within 7 days and conversions are low
      const endDate = new Date(campaign.endDate);
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 3600 * 24));

      if (daysLeft <= 7 && campaign.status === 'active' && campaign.conversions < 10) {
        await sendNotificationEmail(campaign);
      }
    });

  } catch (error) {
    console.error('Error fetching campaigns or sending emails:', error);
  }
};

// Call this function to trigger email notifications for all campaigns
testEmailNotification();


// Call this function at regular intervals
checkCampaignMetrics();
