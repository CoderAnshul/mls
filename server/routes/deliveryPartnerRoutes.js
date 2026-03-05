const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');

// GET all delivery partners
router.get('/', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching delivery partners' });
  }
});

// POST create a delivery partner
router.post('/', async (req, res) => {
  try {
    const partner = new DeliveryPartner(req.body);
    const saved = await partner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a delivery partner
router.put('/:id', async (req, res) => {
  try {
    const updated = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Partner not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a delivery partner
router.delete('/:id', async (req, res) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting partner' });
  }
});

module.exports = router;
