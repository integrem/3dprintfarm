// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  serviceProvider: {
    type: String,
    required: false // Make it optional initially
  },
  printer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Printer',
    required: false // Make it optional initially
  },
  printerId: String, // Keep for backward compatibility
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'printing', 'completed', 'cancelled', 'failed'],
    default: 'pending' // Change default to pending since it's not assigned yet
  },
  notes: String,
  estimatedTime: Number, // in minutes
  actualTime: Number, // in minutes
  price: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);