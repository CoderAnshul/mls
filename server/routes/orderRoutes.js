const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, user } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const newOrder = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    // If COD, payment status is unpaid by default.
    if (paymentMethod === 'cod') {
      newOrder.paymentStatus = 'unpaid';
      newOrder.status = 'pending';
    } else {
      // For demo purposes, we'll mark other methods as paid if they were successful
      newOrder.paymentStatus = 'paid';
      newOrder.status = 'processing';
    }

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error while creating order', error: err.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only - simplification)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/user/:userId
// @desc    Get orders by a specific user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating order' });
  }
});

// @route   POST /api/orders/:id/dispatch
// @desc    Dispatch an order — assign delivery partner + tracking number
// @access  Private/Admin
router.post('/:id/dispatch', async (req, res) => {
  try {
    const { partnerId, partnerName, partnerCode, trackingNumber, trackingUrl, notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.dispatchInfo = {
      partnerId: partnerId || null,
      partnerName: partnerName || '',
      partnerCode: partnerCode || '',
      trackingNumber: trackingNumber || '',
      trackingUrl: trackingUrl || '',
      dispatchedAt: new Date(),
      notes: notes || ''
    };
    order.status = 'shipped';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error('Dispatch error:', err);
    res.status(500).json({ message: 'Server error dispatching order' });
  }
});

module.exports = router;
