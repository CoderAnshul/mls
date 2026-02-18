const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort('order');
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create FAQ
router.post('/', async (req, res) => {
    const faq = new FAQ(req.body);
    try {
      const newFaq = await faq.save();
      res.status(201).json(newFaq);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;
