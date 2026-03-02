console.log('fairController.js se cargó correctamente');

const Fair = require('../models/Fair');

exports.createFair = async (req, res) => {
  try {
    const { name, location, date, description } = req.body;

    if (!req.files?.length) return res.status(400).json({ msg: 'Sube al menos 1 imagen' });

    const imageUrls = req.files.map(f => `/uploads/${f.filename}`);

    const fair = new Fair({
      name,
      location,
      date: date ? new Date(date) : undefined,
      description: description || '',
      imageUrls
    });

    await fair.save();
    res.status(201).json(fair);
  } catch (err) {
    console.error('Error createFair:', err);
    res.status(500).json({ msg: 'Error creando feria' });
  }
};

exports.getFairs = async (req, res) => {
  try {
    const fairs = await Fair.find().populate('products', 'name');
    res.json(fairs);
  } catch (err) {
    console.error('Error getFairs:', err);
    res.status(500).json({ msg: 'Error listando ferias' });
  }
};

exports.getFairById = async (req, res) => {
  try {
    const fair = await Fair.findById(req.params.id).populate('products', 'name');
    if (!fair) return res.status(404).json({ msg: 'Feria no encontrada' });
    res.json(fair);
  } catch (err) {
    console.error('Error getFairById:', err);
    res.status(500).json({ msg: 'Error obteniendo feria' });
  }
};