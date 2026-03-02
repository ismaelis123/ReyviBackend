const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ msg: 'Nombre requerido' });
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ msg: 'Ya existe' });
    const category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ msg: 'Error creando categoría' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Error listando categorías' });
  }
};