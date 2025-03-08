const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true } // Store icon as a string or URL
});

module.exports = mongoose.model('Feature', featureSchema);