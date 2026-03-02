const Store = require('../models/Store');
const cloudinary = require('../config/cloudinary');

exports.createStore = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Sube al menos una imagen' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'reyvi/tiendas' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        uploadStream.end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

    const store = new Store({ name, address, imageUrls });
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    console.error('Error subiendo tienda a Cloudinary:', err);
    res.status(500).json({ msg: 'Error al crear tienda' });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ name: 1 });
    res.json(stores);
  } catch (err) {
    console.error('Error en getStores:', err);
    res.status(500).json({ msg: 'Error al listar tiendas' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ msg: 'Tienda no encontrada' });
    res.json(store);
  } catch (err) {
    console.error('Error en getStoreById:', err);
    res.status(500).json({ msg: 'Error al obtener tienda' });
  }
};