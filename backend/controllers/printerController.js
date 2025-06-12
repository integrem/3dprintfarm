const Printer = require('../models/Printer');

exports.deletePrinter = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req; // Assuming you have user info from auth middleware
    
    // Find the printer first to check ownership
    const printer = await Printer.findById(id);
    
    if (!printer) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    
    // Check if the user owns this printer (optional security check)
    // if (printer.owner !== user.email) {
    //   return res.status(403).json({ error: 'Unauthorized to delete this printer' });
    // }
    
    await Printer.findByIdAndDelete(id);
    
    console.log('[Delete Success]', id);
    res.status(200).json({ message: 'Printer deleted successfully' });
  } catch (err) {
    console.error('[Delete Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};

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
    const { city, model, capability, status, owner } = req.query;

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

    if (owner) {
      query.owner = { $regex: owner }; // partial match
    }

    const printers = await Printer.find(query);
    console.log('[Filtered Printers]', query, printers);
    res.json(printers);
  } catch (err) {
    console.error('[Get Printers Error]', err.message);
    res.status(500).json({ error: err.message });
  }
};