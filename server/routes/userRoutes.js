const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle item in wishlist
// @route   POST /api/user/wishlist/toggle
// @access  Private
router.post('/wishlist/toggle', protect, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    
    // Return the updated populated wishlist
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user cart
// @route   GET /api/user/cart
// @access  Private
router.get('/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Sync user cart
// @route   POST /api/user/cart
// @access  Private
router.post('/cart', protect, async (req, res) => {
  const { cart } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    // Transform cart to store in DB
    user.cart = cart.map(item => ({
      product: item._id || item.id,
      selectedSize: item.selectedSize,
      selectedLength: item.selectedLength,
      selectedColor: item.selectedColor,
      quantity: item.quantity
    }));

    await user.save();
    
    // Return the updated populated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
