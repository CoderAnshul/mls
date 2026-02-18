const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  heroImage: {
    type: String, // URL
  },
  excerpt: {
      type: String,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Storing blocks or HTML structure
  },
  ctaText: String,
  ctaLink: String,
  isPublished: {
      type: Boolean,
      default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
