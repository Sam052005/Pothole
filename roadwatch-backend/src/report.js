const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  images: [{ type: String }],
  dateReported: { type: Date, default: Date.now },
  status: { type: String, default: 'reported' },
  reportedBy: { type: String, default: 'Anonymous User' },
  upvotes: { type: Number, default: 0 },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;