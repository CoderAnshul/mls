const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

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

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // We don't allow email updates in this version for simplicity/security
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/user/orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
  try {
    // Import Order model here to avoid circular dependencies if any, 
    // or just require it at the top of the file
    const Order = require('../models/Order');
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/user
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  try {
    const users = await User.find({ ...keyword }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
