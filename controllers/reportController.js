const Lead = require('../models/lead.model');
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');

// Generate PDF report
const generatePDF = async (req, res) => {
  const leads = await Lead.find();
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.text('Leads Report', { align: 'center' });
  leads.forEach(lead => {
    doc.text(`${lead.name}, ${lead.email}, ${lead.status}`);
  });
  doc.end();
};

// Generate CSV report
const generateCSV = async (req, res) => {
  const leads = await Lead.find();
  const csvWriter = createObjectCsvWriter({
    path: 'leads-report.csv',
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'status', title: 'Status' }
    ]
  });

  await csvWriter.writeRecords(leads);
  res.download('leads-report.csv');
};

module.exports = { generatePDF, generateCSV };
