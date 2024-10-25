const express = require('express');
const { getCampaigns, saveCampaigns } = require('../controllers/campaignController');
const router = express.Router();

router.get('/campaigns', getCampaigns);
router.post('/campaigns', saveCampaigns);

module.exports = router;
