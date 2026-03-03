const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getPostById);          // ← esto faltaba
router.post('/', auth, uploadMultiple, createPost);
router.put('/:id', auth, uploadMultiple, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;