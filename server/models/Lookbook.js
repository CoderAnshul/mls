const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    images: [{
        type: String, // URLs of images
        required: true,
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Lookbook', lookbookSchema);
