const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

const fairController = require('../controllers/fairController');

console.log('fairController en routes:', fairController);
console.log('getFairs existe?', !!fairController.getFairs);

router.get('/', fairController.getFairs);
router.get('/:id', fairController.getFairById);
router.post('/', auth, uploadMultiple, fairController.createFair);

module.exports = router;