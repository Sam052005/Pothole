const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const connectDB = require('./db');
const Report = require('./report');
const features = require('./features');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.get('/api/features', (req, res) => {
  res.json(features);
});

app.post('/api/reports', upload.array('images', 3), async (req, res) => {
  const { title, description, severity, location } = req.body;
  const images = req.files ? req.files.map(file => file.buffer.toString('base64')) : [];

  const newReport = new Report({
    title,
    description,
    severity,
    location: JSON.parse(location),
    images,
  });

  try {
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});