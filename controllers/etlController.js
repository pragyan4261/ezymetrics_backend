// controllers/etlController.js
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Step 1: Extract (read from the CSV)
const extractData = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', (err) => reject(err));
  });
};

// Step 2: Transform (modify the data)
const transformData = (data) => {
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
};

// Step 3: Load (write the transformed data to a new CSV file)
const loadData = (transformedData, outputFilePath) => {
  const writeStream = fs.createWriteStream(outputFilePath);

  // Write the header
  writeStream.write('id,name,email,status\n');

  transformedData.forEach((row) => {
    writeStream.write(`${row.id},${row.name},${row.email},${row.status}\n`);
  });

  writeStream.end();
};

exports.runEtl = async (req, res) => {
  try {
    const filePath = req.file.path;
    const data = await extractData(filePath);
    const transformedData = transformData(data);

    const outputFilePath = path.join(__dirname, '../uploads', 'transformed.csv');
    loadData(transformedData, outputFilePath);

    // Send the transformed CSV file back to the client
    res.download(outputFilePath, 'transformed.csv', (err) => {
      if (err) throw err;
      // Clean up files after sending response
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputFilePath);
    });
  } catch (error) {
    console.error('ETL process failed:', error);
    res.status(500).send('ETL process failed');
  }
};
