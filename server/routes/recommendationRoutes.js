const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');

// Get all recommendations (for admin)
router.get('/all', async (req, res) => {
  try {
    const recommendations = await Recommendation.find().populate('product');
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get active recommendations by type (for frontend)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    
    const recommendations = await Recommendation.find(query)
      .populate('product')
      .sort({ order: 1 });
      
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create recommendation
router.post('/', async (req, res) => {
  const recommendation = new Recommendation(req.body);
  try {
    const newRecommendation = await recommendation.save();
    const populated = await Recommendation.findById(newRecommendation._id).populate('product');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update recommendation
router.put('/:id', async (req, res) => {
  try {
    const updated = await Recommendation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('product');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete recommendation
router.delete('/:id', async (req, res) => {
  try {
    await Recommendation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recommendation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
