const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/roadwatch', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Feature = require('Pothole\src\models\feature.js');

// Get all features
app.get('/api/features', async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new feature
app.post('/api/features', async (req, res) => {
  const feature = new Feature(req.body);
  try {
    const savedFeature = await feature.save();
    res.status(201).json(savedFeature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});