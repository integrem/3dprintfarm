// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./db/connect');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173'  // Allow requests only from your frontend dev server
}));

// Routes
app.use('/api/printers', require('./routes/printers'));
app.use('/api/jobs', require('./routes/jobs'));

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});