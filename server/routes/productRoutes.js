const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (with optional filtering and pagination)
router.get('/', async (req, res) => {
    try {
        const { category, isNew, limit, page, sizes, colors, types, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (category && category.toUpperCase() !== 'ALL') {
            const searchPattern = category.trim().replace(/[_\s-]/g, '[\\s_-]+');
            query.category = { $regex: new RegExp(`^${searchPattern}$`, 'i') };
        }
        if (isNew) query.isNew = true;

        if (sizes) query.sizes = { $in: sizes.split(',') };
        if (colors) query.colors = { $in: colors.split(',') };
        // If types are passed, we filter subCategory or category based on them
        if (types) {
            query.subCategory = { $in: types.split(',').map(t => new RegExp(t, 'i')) };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { createdAt: -1 };
        if (sort === 'PRICE - LOW TO HIGH') sortOption = { price: 1 };
        else if (sort === 'PRICE - HIGH TO LOW') sortOption = { price: -1 };
        else if (sort === 'BESTSELLERS') sortOption = { isBestSeller: -1, createdAt: -1 };
        else if (sort === 'NEW ARRIVALS') sortOption = { createdAt: -1 };

        let productsQuery = Product.find(query);

        if (page) {
            const p = Number(page) || 1;
            const l = Number(limit) || 10;
            const skip = (p - 1) * l;
            
            const total = await Product.countDocuments(query);
            const products = await Product.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(l)
                .exec();

            return res.json({
                products,
                total,
                page: p,
                pages: Math.ceil(total / l)
            });
        }

        if (limit) productsQuery = productsQuery.limit(Number(limit));

        const result = await productsQuery.sort(sortOption).exec();
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

// Bulk delete products
router.post('/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Missing or invalid IDs' });
        }
        await Product.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Products deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
