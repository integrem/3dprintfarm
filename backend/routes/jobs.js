const express = require('express');
const router = express.Router();
const { submitJob, assignJob, getJobStatus } = require('../controllers/jobController');

router.post('/', submitJob);
router.post('/:id/assign', assignJob);
router.get('/:id', getJobStatus);

module.exports = router;