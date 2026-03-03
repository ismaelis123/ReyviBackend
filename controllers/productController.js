const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const createProduct = async (req, res) => {
  try {
    const { name, description, category, newCategoryName } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Sube al menos una imagen' });
    }

    let categoryId = category;

    if (newCategoryName && newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim();
      let existing = await Category.findOne({ name: trimmedName });
      if (existing) {
        categoryId = existing._id;
      } else {
        const newCat = new Category({ name: trimmedName });
        await newCat.save();
        categoryId = newCat._id;
      }
    }

    if (!categoryId) {
      return res.status(400).json({ msg: 'Debes seleccionar una categoría existente o escribir el nombre de una nueva' });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ msg: 'ID de categoría inválido' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'reyvi/productos' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        uploadStream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }

    const product = new Product({
      name,
      description: description || '',
      category: categoryId,
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de producto inválido' });
    }

    const product = await Product.findById(id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error obteniendo producto:', err);
    res.status(500).json({ msg: 'Error al obtener producto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, newCategoryName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de producto inválido' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

    let categoryId = category || product.category;

    if (newCategoryName && newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim();
      let existing = await Category.findOne({ name: trimmedName });
      if (existing) {
        categoryId = existing._id;
      } else {
        const newCat = new Category({ name: trimmedName });
        await newCat.save();
        categoryId = newCat._id;
      }
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ msg: 'ID de categoría inválido' });
    }

    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.category = categoryId;

    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'reyvi/productos' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(file.buffer);
        });
        newUrls.push(result.secure_url);
      }
      product.imageUrls = [...product.imageUrls, ...newUrls];
    }

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name');
    res.json(updated);
  } catch (err) {
    console.error('Error actualizando producto:', err);
    res.status(500).json({ msg: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de producto inválido' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.status(500).json({ msg: 'Error al eliminar producto' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};