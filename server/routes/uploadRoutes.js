const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the path. If BASE_URL is set (production), we use it. 
  // Otherwise, we return a relative path which the frontend can prefix.
  // This prevents 'localhost' from being hardcoded in DB entries during production.
  const baseUrl = process.env.BASE_URL || '';
  const fileUrl = baseUrl 
    ? `${baseUrl}/uploads/${req.file.filename}`
    : `/uploads/${req.file.filename}`;
    
  res.json({ url: fileUrl });
});

module.exports = router;
