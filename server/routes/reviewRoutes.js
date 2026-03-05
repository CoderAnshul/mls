const express = require('express');
const router = express.Router();
const os = require('os');
const multer = require('multer');
const xlsx = require('xlsx');
const Review = require('../models/Review');
const fs = require('fs');

const upload = multer({ dest: os.tmpdir() });

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a review
router.post('/', async (req, res) => {
    const review = new Review(req.body);
    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a review (e.g., status)
router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a review
router.delete('/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Bulk Import from Excel
router.post('/bulk-import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const reviewsToInsert = data.map(item => ({
            name: item.Name || item.name || 'Anonymous',
            review: item.Review || item.review || item.Comment || item.comment || '',
            location: item.Location || item.location || '',
            date: item.Date || item.date || new Date().toLocaleDateString(),
            rating: parseInt(item.Rating || item.rating) || 5,
            status: 'Approved',
            isVerified: true
        })).filter(r => r.review);

        if (reviewsToInsert.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'No valid review data found in file' });
        }

        const inserted = await Review.insertMany(reviewsToInsert);
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({ 
            message: `Successfully imported ${inserted.length} reviews`,
            count: inserted.length
        });
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
