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
      // Use absolute path for local/Render storage
      cb(null, path.join(__dirname, '..', 'uploads'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
  }
});

router.post('/', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ 
        message: err.message || 'Error processing file upload',
        error: err.code || 'UPLOAD_ERROR'
      });
    }

    // Since we use upload.any(), files are in req.files array
    const file = req.files && req.files[0];

    if (!file) {
      console.error('No files found in request. Received fields:', Object.keys(req.body));
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log(`File received: ${file.originalname} via field: ${file.fieldname}`);

    // BASE_URL must be set in Vercel/Render env vars (e.g. https://mls-api.vercel.app)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;

    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      
    res.json({ url: fileUrl });
  });
});

module.exports = router;
