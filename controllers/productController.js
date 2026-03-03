const Product = require('../models/Product');
const Category = require('../models/Category'); // ← agregamos esto
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const createProduct = async (req, res) => {
  try {
    const { name, description, category, newCategoryName } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'Sube al menos una imagen' });
    }

    let categoryId = category;

    // 1. Si enviaron un nombre nuevo de categoría → créala
    if (newCategoryName && newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim();

      // Evitar duplicados
      let existing = await Category.findOne({ name: trimmedName });
      if (existing) {
        categoryId = existing._id;
      } else {
        const newCat = new Category({ name: trimmedName });
        await newCat.save();
        categoryId = newCat._id;
      }
    }

    // 2. Si no hay categoría ni nueva → error
    if (!categoryId) {
      return res.status(400).json({ msg: 'Debes seleccionar una categoría existente o escribir el nombre de una nueva' });
    }

    // 3. Validar que el ID sea válido
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

const updateProduct = async (req, res) => {
  try {
    const { name, description, category, newCategoryName } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

    let categoryId = category || product.category;

    // Si enviaron nueva categoría
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

    // Actualizar campos
    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.category = categoryId;

    // Si subieron nuevas imágenes → agregarlas (no reemplazar)
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
    const product = await Product.findByIdAndDelete(req.params.id);
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
  updateProduct,
  deleteProduct
};