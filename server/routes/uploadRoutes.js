const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const os = require('os');

// Configure storage for Vercel support
// We use os.tmpdir() because Vercel has a read-only filesystem except for /tmp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (process.env.VERCEL) {
      cb(null, os.tmpdir());
    } else {
      cb(null, 'uploads/');
    }
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
  
  // Always return a full absolute URL so the frontend knows where to load the image from.
  // Use the configured BASE_URL if available, otherwise derive it from the request host.
  const baseUrl = process.env.BASE_URL 
    || `${req.protocol}://${req.get('host')}`;

  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
  res.json({ url: fileUrl });
});

module.exports = router;
