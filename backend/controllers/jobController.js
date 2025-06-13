const Job = require('../models/Job');
const path = require('path');

exports.submitJob = async (req, res) => {
  try {
    console.log('[Submit Job] Request body:', req.body);
    console.log('[Submit Job] File:', req.file);
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { clientName, material, color, notes } = req.body;
    
    // Create new job with file information
    const job = new Job({
      clientName,
      fileUrl: `/uploads/${req.file.filename}`, // Store relative path
      fileName: req.file.originalname,
      fileSize: req.file.size,
      filePath: req.file.path,
      material,
      color,
      notes,
      status: 'pending'
    });
    
    await job.save();
    
    console.log('[Submit Job Success]', job);
    res.status(201).json(job);
  } catch (err) {
    console.error('[Submit Job Error]', err.message);
    console.error('[Submit Job Error Details]', err);
    res.status(500).json({ error: err.message });
  }
};

// Keep your other functions as they are
exports.assignJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { printerId } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      id,
      { 
        printer: printerId,
        printerId: printerId,
        status: 'assigned',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    console.log('[Assign Job Success]', { jobId: id, printerId });
    res.json(job);
  } catch (err) {
    console.error('[Assign Job Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { clientName, status, printerId } = req.query;
    
    const query = {};
    
    if (clientName) {
      query.clientName = clientName;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (printerId) {
      query.printerId = printerId;
    }
    
    const jobs = await Job.find(query)
      .populate('printer')
      .sort({ createdAt: -1 });
    
    console.log('[Get Jobs]', { query, count: jobs.length });
    res.json(jobs);
  } catch (err) {
    console.error('[Get Jobs Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id).populate('printer');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error('[Get Job Status Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};