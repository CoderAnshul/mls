const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, isNew, limit } = req.query;
    let query = {};

    if (category && category !== 'ALL') {
        query.category = { $regex: new RegExp(category, 'i') };
    }
    if (isNew) query.isNew = true;

    let products = Product.find(query);
    
    if (limit) products = products.limit(Number(limit));

    const result = await products.sort({ createdAt: -1 }).exec();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        let product;
        
        // Try finding by ID first, then by slug
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(idOrSlug).populate('wearWith');
        } else {
            product = await Product.findOne({ slug: idOrSlug }).populate('wearWith');
        }

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create product
router.post('/', async (req, res) => {
  const productData = { ...req.body };
  if (!productData.slug && productData.title) {
      productData.slug = productData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  
  const product = new Product(productData);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
