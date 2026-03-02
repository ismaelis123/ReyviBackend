const Fair = require('../models/Fair');
const cloudinary = require('../config/cloudinary');

exports.createFair = async (req, res) => {
  try {
    const { name, location, date, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Sube al menos una imagen' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'reyvi/ferias' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        uploadStream.end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

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
    console.error('Error subiendo feria a Cloudinary:', err);
    res.status(500).json({ msg: 'Error al crear feria' });
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