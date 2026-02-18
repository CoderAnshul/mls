const mongoose = require('mongoose');

const homeAssetSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'hero_banner', 'brand_statement'
    type: { type: String, enum: ['image', 'text', 'link', 'object'], required: true },
    value: mongoose.Schema.Types.Mixed,
    description: String
}, { timestamps: true });

module.exports = mongoose.model('HomeAsset', homeAssetSchema);
