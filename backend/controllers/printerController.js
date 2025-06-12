const Printer = require('../models/Printer');

exports.registerPrinter = async (req, res) => {
  try {
    console.log('[RegisterPrinter] Request body:', req.body);
    const printer = new Printer({
      owner: req.body.owner,
      model: req.body.model,
      ip: req.body.ip,
      capabilities: req.body.capabilities,
      location: {
        city: req.body.location?.city,
        suburb: req.body.location?.suburb,
        coordinates: req.body.location?.coordinates
      },
      status: 'online',
      lastSeen: new Date()
    });
    await printer.save();
    console.log('[Register Success]', printer);
    res.status(201).json(printer);
  } catch (err) {
    console.error('[Register Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailablePrinters = async (req, res) => {
  try {
    const { city, model, capability, status } = req.query;

    const query = {};

    // Default to 'online' if not specified
    query.status = status || 'online';

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' }; // partial & case-insensitive
    }

    if (model) {
      query.model = { $regex: model, $options: 'i' }; // partial match
    }

    if (capability) {
        query.capabilities = { $elemMatch: { $regex: capability, $options: 'i' } };
    }

    const printers = await Printer.find(query);
    console.log('[Filtered Printers]', query, printers);
    res.json(printers);
  } catch (err) {
    console.error('[Get Printers Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};