const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { submitJob, assignJob, getJobStatus, getJobs } = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');
const Job = require('../models/Job');
const Printer = require('../models/Printer');

// Get all jobs or filter by query parameters
router.get('/', getJobs);

// Get jobs for a service provider
router.get('/provider-jobs', verifyToken, async (req, res) => {
//router.get('/provider-jobs', async (req, res) => {
  try {
    const serviceProviderEmail = req.user.email;

    // Find all jobs assigned to this service provider (excluding pending jobs)
    const jobs = await Job.find({ 
      serviceProvider: serviceProviderEmail,
      status: { $ne: 'pending' } // Exclude pending jobs that aren't assigned yet
    })
    .populate('printer')
    .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Fetch provider jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job statistics for service provider
router.get('/provider-stats', verifyToken, async (req, res) => {
  try {
    const serviceProviderEmail = req.user.email;

    const stats = await Job.aggregate([
      { 
        $match: { 
          serviceProvider: serviceProviderEmail,
          status: { $ne: 'pending' } // Exclude pending jobs
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ 
      serviceProvider: serviceProviderEmail,
      status: { $ne: 'pending' } // Exclude pending jobs
    });

    res.json({
      totalJobs,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error('Fetch provider stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create a new job with file upload
router.post('/', upload.single('file'), submitJob);

// Assign job to a printer (updated to include service provider)
router.post('/assign', verifyToken, async (req, res) => {
  try {
    const { 
      jobId, 
      printerId, 
      material, 
      color, 
      notes 
    } = req.body;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Find the printer and get its owner
    const printer = await Printer.findById(printerId);
    if (!printer) {
      return res.status(404).json({ error: 'Printer not found' });
    }

    // Update the job with printer and service provider information
    job.printer = printerId;
    job.printerId = printerId;
    job.serviceProvider = printer.owner; // Add service provider
    job.material = material;
    job.color = color;
    job.notes = notes;
    job.status = 'assigned';

    await job.save();

    res.json({ 
      message: 'Job assigned successfully', 
      job 
    });
  } catch (error) {
    console.error('Assign job error:', error);
    res.status(500).json({ error: 'Failed to assign job' });
  }
});

// Legacy assign job endpoint (keeping for backward compatibility)
router.post('/:id/assign', assignJob);

// Update job status
router.patch('/:jobId/status', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const userEmail = req.user.email;

    // Find the job and verify ownership
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify the user is the service provider for this job
    if (job.serviceProvider !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized to update this job' });
    }

    // Validate status
    const validStatuses = ['pending', 'assigned', 'printing', 'completed', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update status
    job.status = status;
    await job.save();

    res.json({ message: 'Status updated successfully', job });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get single job status
router.get('/:id', getJobStatus);

module.exports = router;