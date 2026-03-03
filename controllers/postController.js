const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: 'Título y contenido son obligatorios' });
    }

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

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de publicación inválido' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error obteniendo post:', err);
    res.status(500).json({ msg: 'Error al obtener publicación' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de publicación inválido' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Publicación no encontrada' });

    post.title = title || post.title;
    post.content = content || post.content;

    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'reyvi/posts' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(file.buffer);
        });
        newUrls.push(result.secure_url);
      }
      post.imageUrls = [...post.imageUrls, ...newUrls]; // agrega nuevas imágenes
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error actualizando post:', err);
    res.status(500).json({ msg: 'Error al actualizar publicación' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de publicación inválido' });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ msg: 'Publicación no encontrada' });

    res.json({ msg: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando post:', err);
    res.status(500).json({ msg: 'Error al eliminar publicación' });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };