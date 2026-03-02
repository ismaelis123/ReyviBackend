const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error servidor' });
  }
};

exports.createInitialAdmin = async () => {
  try {
    if (await User.findOne({ email: process.env.ADMIN_EMAIL })) return;
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({ email: process.env.ADMIN_EMAIL, password: hashed });
    console.log('Admin creado');
  } catch (err) {
    console.error('Error creando admin:', err);
  }
};