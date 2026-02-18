const express = require('express');
const router = express.Router();
const HomeAsset = require('../models/HomeAsset');

// Get all home assets
router.get('/', async (req, res) => {
    try {
        const assets = await HomeAsset.find();
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update or create a home asset (upsert)
router.post('/', async (req, res) => {
    const { key, value, type, description } = req.body;
    try {
        const asset = await HomeAsset.findOneAndUpdate(
            { key },
            { value, type, description },
            { upsert: true, new: true }
        );
        res.json(asset);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
