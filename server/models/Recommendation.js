const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: 'Add this product to your order and get 25% OFF'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['checkout', 'cart'],
    default: 'checkout'
  },
  discountPercentage: {
    type: Number,
    default: 25
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
