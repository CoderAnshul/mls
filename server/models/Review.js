const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    review: { type: String, required: true },
    location: { type: String },
    date: { type: String },
    rating: { type: Number, default: 5 },
    status: { 
        type: String, 
        enum: ['Approved', 'Pending', 'Spam'], 
        default: 'Approved' 
    },
    isVerified: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
