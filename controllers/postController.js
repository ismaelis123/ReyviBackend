const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'reyvi/posts' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    const post = new Post({
      title,
      content,
      imageUrls,
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creando post:', err);
    res.status(500).json({ msg: 'Error al crear publicación', error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error listando posts:', err);
    res.status(500).json({ msg: 'Error al obtener publicaciones' });
  }
};

module.exports = { createPost, getPosts };