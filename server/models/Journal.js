const mongoose = require('mongoose');

const editorContentSchema = new mongoose.Schema(
  {
    time: { type: Number },
    blocks: [
      {
        type: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    version: { type: String },
  },
  { _id: false }
);

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
    type: editorContentSchema,
  },
  ctaText: String,
  ctaLink: String,
  isPublished: {
      type: Boolean,
      default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
