const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');
const { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', auth, uploadMultiple, createProduct);
router.put('/:id', auth, uploadMultiple, updateProduct); // ← NUEVA RUTA PARA EDITAR
router.delete('/:id', auth, deleteProduct);

module.exports = router;