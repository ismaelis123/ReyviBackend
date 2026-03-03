require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const fairRoutes = require('./routes/fairs');
const storeRoutes = require('./routes/stores');
const postRoutes = require('./routes/posts');

const { createInitialAdmin } = require('./controllers/authController');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/fairs', fairRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB conectado');
    await createInitialAdmin();
  })
  .catch(err => console.error('Error DB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));