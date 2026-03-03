const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById); // ← esta ruta faltaba o estaba mal
router.post('/', auth, uploadMultiple, createProduct);
router.put('/:id', auth, uploadMultiple, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;