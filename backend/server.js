const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_scrapbook';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Successfully connected to MongoDB database.'))
  .catch((err) => {
    console.error('❌ MongoDB database connection error:', err.message);
    console.log('Ensure MongoDB service is running locally or check the MONGO_URI in your .env file.');
  });

const giftRoutes = require('./routes/giftRoutes');

// API Routes
app.use('/api/gift', giftRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Digital Scrapbook Backend API!',
    status: 'Healthy',
    timestamp: new Date()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    uptime: process.uptime()
  });
});

// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
