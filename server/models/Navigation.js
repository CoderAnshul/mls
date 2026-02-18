const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema({
  title: {
    type: String, // e.g., 'CLOTHING', 'RAMADAN COLLECTION'
    required: true,
    unique: true
  },
  href: String,
  order: Number,
  sections: [
    {
      heading: String, // 'SHOP BY COLLECTION'
      links: [
        {
          label: String, // 'Abayas'
          href: String
        }
      ]
    }
  ],
  features: [
    {
      title: String,
      image: String,
      link: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Navigation', navigationSchema);
