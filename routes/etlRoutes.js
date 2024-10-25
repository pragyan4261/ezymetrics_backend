// routes/etlRoutes.js
const express = require('express');
const multer = require('multer');
const etlController = require('../controllers/etlController');

const router = express.Router();

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Define the route for uploading the file and running ETL
router.post('/upload', upload.single('file'), etlController.runEtl);

module.exports = router;
