const Job = require('../models/Job');
const Printer = require('../models/Printer');

exports.submitJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const printer = await Printer.findById(req.body.printerId);

    if (!job || !printer) {
      return res.status(404).json({ error: 'Job or printer not found' });
    }

    job.assignedPrinter = printer._id;
    job.status = 'assigned';
    await job.save();

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('assignedPrinter');
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};