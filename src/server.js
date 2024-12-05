// src/server.js
const express = require('express');
var cors = require('cors');
const router = require('./routes/index');
const { Client } = require('pg');
require('dotenv').config();

// Initialize your Express app (or any other framework you're using)
const app = express();
app.use(cors())
// Database connection setup
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, // Ensure the password is correct and a valid string
  port: process.env.DB_PORT,
});

app.use('/', router);

client.connect()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Database connection error", err.stack);
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
