const express = require('express');
const router = express.Router();
const Navigation = require('../models/Navigation');

// Get navigation structure
router.get('/', async (req, res) => {
  try {
    const navItems = await Navigation.find().sort('order');
    res.json(navItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new navigation item
router.post('/', async (req, res) => {
  const navigation = new Navigation(req.body);
  try {
    const newNav = await navigation.save();
    res.status(201).json(newNav);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update navigation item
router.put('/:id', async (req, res) => {
  try {
    const updatedNav = await Navigation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNav);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete navigation item
router.delete('/:id', async (req, res) => {
  try {
    await Navigation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Navigation item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
