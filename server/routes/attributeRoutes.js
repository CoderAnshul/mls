const express = require('express');
const router = express.Router();
const Attribute = require('../models/Attribute');

// Get all attributes
router.get('/', async (req, res) => {
    try {
        const attributes = await Attribute.find();
        res.json(attributes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create/Update an attribute (upsert style for simplicity)
router.post('/', async (req, res) => {
    try {
        const { name, type, values } = req.body;
        let attr = await Attribute.findOne({ name });
        if (attr) {
            attr.values = values;
            await attr.save();
        } else {
            attr = new Attribute({ name, type, values });
            await attr.save();
        }
        res.json(attr);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
