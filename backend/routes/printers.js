const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
console.log('[Routes/Printers.js] printerController object:', printerController);
console.log('Inside printers.js route file');

router.post('/register', (req, res, next) => {
  console.log(`[Routes/Printers.js] POST /register route matched. Path: ${req.path}, Method: ${req.method}`);
  printerController.registerPrinter(req, res);
});

router.get('/available', printerController.getAvailablePrinters);

// FIX: Change this line - use printerController.deletePrinter
router.delete('/:id', printerController.deletePrinter);  // Note: removed '/printers' prefix

module.exports = router;