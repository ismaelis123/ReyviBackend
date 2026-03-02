const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createCategory, getCategories } = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', auth, createCategory);

module.exports = router;