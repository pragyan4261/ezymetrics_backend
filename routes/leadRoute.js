const express = require('express');
const { getLeads, saveLeads } = require('../controllers/leadController');
const router = express.Router();

router.get('/leads', getLeads);
router.post('/leads', saveLeads);

module.exports = router;
