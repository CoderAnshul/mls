const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// Get all journals
router.get('/', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single journal by slug
router.get('/:slug', async (req, res) => {
  try {
    const journal = await Journal.findOne({ slug: req.params.slug });
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create journal
router.post('/', async (req, res) => {
    const journal = new Journal(req.body);
    try {
      const newJournal = await journal.save();
      res.status(201).json(newJournal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;
