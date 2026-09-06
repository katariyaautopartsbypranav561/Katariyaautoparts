const express = require('express');
const router = express.Router();

// POST /api/upload
// Accepts a base64-encoded file as JSON: { file: "data:image/...;base64,..." }
router.post('/', async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided in request body' });
    }

    // Validate it looks like a base64 data URI
    if (!file.startsWith('data:')) {
      return res.status(400).json({ error: 'Invalid file format – expected base64 data URI' });
    }

    // Local Dev Mock: Just return the base64 string itself as the "URL".
    // This allows the frontend to save the base64 string directly into the database.
    res.json({ url: file, type: 'image' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Failed to mock upload file' });
  }
});

module.exports = router;
