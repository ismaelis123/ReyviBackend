const mongoose = require('mongoose');

const fairSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  description: { type: String, trim: true, default: '' },
  imageUrls: { type: [String], required: true, minlength: 1 },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fair', fairSchema);