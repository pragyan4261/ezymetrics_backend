const express = require('express');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoute');
const campaignRoutes = require('./routes/campaignRoute');
const metricRoutes = require('./routes/metricRoute');
const etlRoutes = require('./routes/etlRoutes')
const emailRoutes = require('./routes/emailRoute');
const { generatePDF, generateCSV } = require('./controllers/reportController');
const {checkCampaignMetrics} = require('./config/nodemailer');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const cron = require('node-cron');

const app = express();
app.use(express.json());
// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
  credentials: true, // Allow credentials if needed
}));
// Connect to the database
connectDB();

// API routes
app.use('/api', leadRoutes);
app.use('/api', campaignRoutes);
app.use('/api', metricRoutes);
app.use('/api', emailRoutes); // Add this line to use the email routes

  
// Generate PDF Report
app.get('/api/reports/pdf', generatePDF);

// Generate CSV Report
app.get('/api/reports/csv', generateCSV);

// Email Alerts
app.post('/api/alert', (req, res) => {
  const { email, message } = req.body;
  sendAlertEmail(email, message)
    .then(() => res.json({ message: 'Email sent successfully!' }))
    .catch(err => res.status(500).json({ error: 'Failed to send email' }));
});
const upload = multer({ dest: 'uploads/' }); // Folder where files will be uploaded

// Step 1: Extract (read from the uploaded CSV)
function extractData(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', (err) => reject(err));
  });
}

// Step 2: Your existing transformData function
function transformData(data) {
  return data.map((row) => {
    const normalizedRow = {
      id: row.id || row.ID || row.Id || 'N/A',
      name: row.name || row.Name || row.NAME || 'UNKNOWN',
      email: row.email || row.Email || 'N/A',
      status: row.status || row.Status || 'N/A',
    };

    return {
      id: normalizedRow.id,
      name: normalizedRow.name.toUpperCase(),
      email: normalizedRow.email,
      status: normalizedRow.status,
    };
  });
}

// Step 3: Load transformed data to new CSV
function loadData(transformedData) {
  const outputFile = path.join(__dirname, 'output', 'output.csv');
  const writeStream = fs.createWriteStream(outputFile);

  writeStream.write('id,name,email,status\n');
  transformedData.forEach((row) => {
    writeStream.write(`${row.id},${row.name},${row.email},${row.status}\n`);
  });

  writeStream.end(() => {
    console.log('Data has been transformed and written to output.csv');
  });

  return outputFile;
}

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const uploadedFilePath = req.file.path;

    // Extract data from uploaded CSV
    const data = await extractData(uploadedFilePath);

    // Transform data
    const transformedData = transformData(data);

    // Load transformed data to new CSV file
    const outputFile = loadData(transformedData);

    // Send the output file URL back to the client
    res.json({ outputFile: `http://localhost:5000/${outputFile}` });
  } catch (error) {
    console.error('ETL process failed:', error);
    res.status(500).send('An error occurred during the ETL process.');
  }
});
// Schedule the task to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Checking campaign metrics...');
  checkCampaignMetrics();
});
// Serve the output files
app.use('/output', express.static(path.join(__dirname, 'output')));
// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
