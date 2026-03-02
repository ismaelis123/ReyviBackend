const multer = require('multer');

const storage = multer.memoryStorage(); // ← guarda en memoria para subir a Cloudinary

const fileFilter = (req, file, cb) => {
  if (/jpeg|jpg|png|webp/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo imágenes: jpg, jpeg, png, webp'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
  fileFilter
});

module.exports = {
  uploadMultiple: upload.array('images', 8) // máximo 8 imágenes por subida
};