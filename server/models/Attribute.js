const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Color Library", "Fabric Registry"
    type: { type: String, required: true }, // e.g. "color", "text", "size"
    values: [{ type: String }], // Array of values e.g. ["#000000", "Silk"]
}, { timestamps: true });

module.exports = mongoose.model('Attribute', attributeSchema);
