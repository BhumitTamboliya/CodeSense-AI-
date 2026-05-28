/**
 * Review Routes
 * POST /api/review        — review pasted code
 * POST /api/review/upload — review uploaded file
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { reviewPaste, reviewUpload } = require('../controllers/reviewController');

// Review pasted code
router.post('/', reviewPaste);

// Review uploaded file (single file with field name "file")
router.post('/upload', upload.single('file'), reviewUpload);

module.exports = router;
