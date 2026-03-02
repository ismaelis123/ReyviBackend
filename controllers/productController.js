const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Sube al menos una imagen' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'reyvi/productos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

    const product = new Product({
      name,
      description: description || '',
      category,
      imageUrls
    });

    await product.save();

    const populated = await Product.findById(product._id).populate('category', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creando producto:', err);
    res.status(500).json({ msg: 'Error al crear producto', error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    console.error('Error listando productos:', err);
    res.status(500).json({ msg: 'Error al obtener productos' });
  }
};

module.exports = {
  createProduct,
  getProducts
};