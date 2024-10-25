This project is an API server built with Node.js and Express.js that includes functionality for managing leads, campaigns, metrics, email alerts, ETL (Extract, Transform, Load) operations, and scheduled tasks.

Table of Contents:

1) Installation
2) Usage
3) API Documentation
4) Leads
5) Campaigns
6) Metrics
7) Reports
8) ETL Process
9) Email Alerts



Installation

Prerequisites
1) Node.js (v14 or above)
2) MongoDB (running on mongodb://localhost:27017/ or customize in config/db.js)

Steps
1) Clone the repository.

git clone <repository_url>
cd <repository_folder>


2) Install dependencies.

npm install


3) Configure environment variables.

4) Run the server.

npm start


The server will start on http://localhost:5000.



Usage

1) Make sure MongoDB is running.
2) Access API endpoints at http://localhost:5000/api/.




API Documentation
1. Leads
GET /api/leads

Fetches all leads.
POST /api/leads

Creates a new lead.

Request Body:

{
  "name": "Lead Name",
  "email": "lead@example.com",
  "status": "active"
}
Response:

{
  "message": "Lead added successfully",
  "data": {
    "id": "12345",
    "name": "Lead Name",
    "email": "lead@example.com",
    "status": "active"
  }
}
2. Campaigns
GET /api/campaigns

Fetches all campaigns.
POST /api/campaigns

Creates a new campaign.

Request Body:

{
  "name": "Campaign Name",
  "status": "active"
}


3. Metrics
GET /api/metrics
Fetches all metrics.


4. Reports
Generate PDF Report
GET /api/reports/pdf

Generates a PDF report.

Generate CSV Report

GET /api/reports/csv
Generates a CSV report.


5. ETL Process
This process allows you to upload a CSV file, transform it, and store the output as a new CSV.

Upload CSV for ETL Processing
POST /upload

Uploads a CSV file for processing.
Request: Form-data with a file input (file).
Response: Returns a URL link to the processed output CSV.


Example Response:

{
  "outputFile": "http://localhost:5000/output/output.csv"
}

File Upload and ETL Processing
Extracts data from the uploaded CSV file.
Transforms data fields (normalizes fields like id, name, email, status).
Loads transformed data into a new CSV, available in the /output folder.

6. Email Alerts
Send an Alert Email

Configuration

To set up email notifications using nodemailer, configure the transporter settings in the email notification code. The transporter configuration currently uses Gmail's SMTP service.

Update Email Credentials in sendNotificationEmail:

Replace 'useremail' with your Gmail address.
Replace 'yourgmailpass' with your app-specific password (generated via Gmail for 2FA-enabled accounts).


It will send an alert email with the provided message.


Scheduled Tasks
1) Hourly Task: Checks campaign metrics every hour.
2) Implemented using node-cron, which logs to the console each hour.

cron.schedule('0 * * * *', () => {
  console.log('Checking campaign metrics...');
  checkCampaignMetrics();
});



Dependencies

express: Web server framework.
mongoose: MongoDB object modeling.
multer: Middleware for handling file uploads.
csv-parser: Parses CSV data for ETL.
node-cron: Schedules tasks.
cors: Cross-origin requests.
nodemailer: Sends email notifications.


Notes
CORS is enabled for requests from http://localhost:5173.
Uploads and generated output files are stored in the uploads/ and output/ folders, respectively.