const Product = require('../models/Product');
const mongoose = require('mongoose');

const createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!req.file) return res.status(400).json({ msg: 'Imagen requerida' });
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ msg: 'ID de categoría inválido' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      description: description || '',
      category,
      imageUrl
    });

    await product.save();
    const populated = await Product.findById(product._id).populate('category', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear producto', error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error al listar productos' });
  }
};

module.exports = { createProduct, getProducts };