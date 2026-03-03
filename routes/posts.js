const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');
const { createPost, getPosts } = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', auth, uploadMultiple, createPost);

module.exports = router;