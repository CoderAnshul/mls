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

    // Find adjacent posts for navigation
    const prev = await Journal.findOne({ date: { $lt: journal.date } })
      .sort({ date: -1 })
      .select('slug title');

    const next = await Journal.findOne({ date: { $gt: journal.date } })
      .sort({ date: 1 })
      .select('slug title');

    res.json({
      ...journal.toObject(),
      prev,
      next
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create journal
router.post('/', async (req, res) => {
  try {
    const journalData = req.body;
    // Ensure content is structured as editorContentSchema
    if (journalData.content && typeof journalData.content === 'object') {
      journalData.content = {
        time: journalData.content.time,
        blocks: journalData.content.blocks,
        version: journalData.content.version,
      };
    }
    const journal = new Journal(journalData);
    const newJournal = await journal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update journal by slug
router.put('/:slug', async (req, res) => {
  try {
    const journalData = req.body;
    if (journalData.content && typeof journalData.content === 'object') {
      journalData.content = {
        time: journalData.content.time,
        blocks: journalData.content.blocks,
        version: journalData.content.version,
      };
    }
    const updatedJournal = await Journal.findOneAndUpdate(
      { slug: req.params.slug },
      journalData,
      { new: true }
    );
    if (!updatedJournal) return res.status(404).json({ message: 'Journal not found' });
    res.json(updatedJournal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete journal by slug
router.delete('/:slug', async (req, res) => {
  try {
    const deletedJournal = await Journal.findOneAndDelete({ slug: req.params.slug });
    if (!deletedJournal) return res.status(404).json({ message: 'Journal not found' });
    res.json({ message: 'Journal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
