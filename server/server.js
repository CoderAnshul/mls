const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins to resolve the 500 error quickly
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));
app.use(express.json());

// Ensure uploads directory exists - wrapped in try-catch for read-only filesystems like Vercel
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.log('--- SYSTEM INFO: Uploads directory creation skipped/failed (Read-only FS) ---');
}

app.use('/uploads', express.static(uploadsDir));

// Global Error Handler for Vercel Debugging
process.on('unhandledRejection', (reason, promise) => {
  console.error('--- UNHANDLED REJECTION ---');
  console.error(reason);
});

process.on('uncaughtException', (err) => {
  console.error('--- UNCAUGHT EXCEPTION ---');
  console.error(err);
});

// Connect to MongoDB with Reliability Options
const connectDB = async () => {
  console.log(`--- DEBUG: MONGO_URI defined: ${!!process.env.MONGO_URI} ---`);
  if (process.env.MONGO_URI) {
    console.log(`--- DEBUG: MONGO_URI length: ${process.env.MONGO_URI.length} ---`);
    console.log(`--- DEBUG: MONGO_URI prefix: ${process.env.MONGO_URI.substring(0, 15)}... ---`);
  }
  
  if (!process.env.MONGO_URI) {
    console.error('--- SYSTEM ERROR: MONGO_URI is not defined in environment variables ---');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`--- SYSTEM: MongoDB Link Established to ${conn.connection.host} ---`);
  } catch (err) {
    console.error('--- SYSTEM ERROR: Database Unavailable ---');
    console.error(`ERROR NAME: ${err.name}`);
    console.error(`ERROR MESSAGE: ${err.message}`);
    // console.error(err);
  }
};

connectDB();

// Health Check & Diagnostic Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected/Buffering';
  res.json({
    status: 'Operational',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.send('AAB Modest Fashion API is active.');
});

// Import Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const journalRoutes = require('./routes/journalRoutes');
const navigationRoutes = require('./routes/navigationRoutes');
const faqRoutes = require('./routes/faqRoutes');
const attributeRoutes = require('./routes/attributeRoutes');
const homeAssetRoutes = require('./routes/homeAssetRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const lookbookRoutes = require('./routes/lookbookRoutes');
const deliveryPartnerRoutes = require('./routes/deliveryPartnerRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/home-assets', homeAssetRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/lookbooks', lookbookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery-partners', deliveryPartnerRoutes);

// Only start the server if not running on Vercel (serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
