const mongoose = require('mongoose');

const PrinterSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  model: { type: String, required: true },
  capabilities: [String],
  status: { type: String, default: 'offline' },
  lastSeen: Date,
  ip: String,

  location: {
    city: { type: String },
    suburb: { type: String },
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  rating: { type: Number, default: 5.0 },
  agentVersion: String
});

module.exports = mongoose.model('Printer', PrinterSchema);