const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with Reliability Options
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('--- SYSTEM: MongoDB Link Established ---');
  } catch (err) {
    console.error('--- SYSTEM ERROR: Database Unavailable ---');
    console.error(err.message);
    // Exit if initial connection fails to prevent 500 loop
    // process.exit(1); 
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
