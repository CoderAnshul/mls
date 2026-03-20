const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update page
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, isActive, metadata } = req.body;
    const page = await Page.findOneAndUpdate(
      { slug },
      { title, content, isActive, metadata },
      { new: true, upsert: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
