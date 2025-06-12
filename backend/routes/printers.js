const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
    console.log('[Routes/Printers.js] printerController object:', printerController); // Add this line
console.log('Inside printers.js route file');
// router.post('/register', printerController.registerPrinter); // Original line
router.post('/register', (req, res, next) => {
  console.log(`[Routes/Printers.js] POST /register route matched. Path: ${req.path}, Method: ${req.method}`);
  // printerController.registerPrinter is defined as (req, res) in printerController.js
  printerController.registerPrinter(req, res); 
});
router.get('/available', printerController.getAvailablePrinters);

module.exports = router;