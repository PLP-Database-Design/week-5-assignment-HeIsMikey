// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set up the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients: ', err);
      return res.status(500).json({ message: 'Error retrieving patients' });
    }
    res.json(results);
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers: ', err);
      return res.status(500).json({ message: 'Error retrieving providers' });
    }
    res.json(results);
  });
});

// Question 3: Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query;
  if (!first_name) {
    return res.status(400).json({ message: 'First name query parameter is required' });
  }

  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error retrieving filtered patients: ', err);
      return res.status(500).json({ message: 'Error retrieving filtered patients' });
    }
    res.json(results);
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query;
  if (!specialty) {
    return res.status(400).json({ message: 'Specialty query parameter is required' });
  }

  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error retrieving providers by specialty: ', err);
      return res.status(500).json({ message: 'Error retrieving providers by specialty' });
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
