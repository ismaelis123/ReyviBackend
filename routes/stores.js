const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const uploadMultiple = require('../middleware/uploadMiddleware').uploadMultiple;

const { createStore, getStores, getStoreById } = require('../controllers/storeController');

router.get('/', getStores);
router.get('/:id', getStoreById);
router.post('/', auth, uploadMultiple, createStore);

module.exports = router;