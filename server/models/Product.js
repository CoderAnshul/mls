const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  coverImage: String,
  hoverImage: String,
  images: [{
    type: String, // URLs
  }],
  gallery: [{ type: String }],
  category: {
    type: String,
    required: true, 
  },
  subCategory: {
    type: String,
  },
  description: String,
  fabricDetails: String,
  careInstructions: String,
  fitInfo: String,
  wearWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isNew: {
    type: Boolean,
    default: false,
  },
  isEditorial: {
      type: Boolean,
      default: false
  },
  isBestSeller: {
      type: Boolean,
      default: false
  },
  sku: String,
  stock: {
      type: Number,
      default: 0
  },
  sizes: [{ type: String }], // 'S', 'M', 'L' etc.
  colors: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
