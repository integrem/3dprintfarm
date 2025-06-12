const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  clientName: String,
  fileUrl: String,
  material: String,
  color: String,
  status: { type: String, default: 'pending' },
  assignedPrinter: { type: mongoose.Schema.Types.ObjectId, ref: 'Printer' },
  submittedAt: { type: Date, default: Date.now },
  completedAt: Date,
});

module.exports = mongoose.model('Job', JobSchema);