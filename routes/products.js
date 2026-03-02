const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

// Diagnóstico temporal - agrega esto
const productCtrl = require('../controllers/productController');
console.log('productController importado:', productCtrl);
console.log('¿getProducts existe?', typeof productCtrl.getProducts === 'function');
console.log('¿createProduct existe?', typeof productCtrl.createProduct === 'function');

// Luego tu desestructuración normal
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

// Rutas...
router.get('/', getProducts);  // ← aquí falla si getProducts es undefined
// ... resto de rutas

module.exports = router;