const express = require('express');
const router = express.Router();
const Lookbook = require('../models/Lookbook');

// Get all lookbooks
router.get('/', async (req, res) => {
    try {
        const lookbooks = await Lookbook.find().sort({ createdAt: -1 });
        res.json(lookbooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single lookbook
router.get('/:id', async (req, res) => {
    try {
        const lookbook = await Lookbook.findById(req.params.id);
        if (!lookbook) return res.status(404).json({ message: 'Lookbook not found' });
        res.json(lookbook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create lookbook
router.post('/', async (req, res) => {
    const lookbook = new Lookbook(req.body);
    try {
        const newLookbook = await lookbook.save();
        res.status(201).json(newLookbook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update lookbook
router.put('/:id', async (req, res) => {
    try {
        const updatedLookbook = await Lookbook.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedLookbook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete lookbook
router.delete('/:id', async (req, res) => {
    try {
        await Lookbook.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lookbook deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
