/**
 * Compare Routes
 * POST /api/compare — compare two code files or snippets
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { compareTwoFiles } = require('../controllers/compareController');

// Accepts either 2 file uploads (field: "files") or JSON body with code1 & code2
router.post('/', upload.array('files', 2), compareTwoFiles);

module.exports = router;
