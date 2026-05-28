/**
 * Share Routes
 * POST /api/share/:reviewId  — generate share link for a review
 * GET  /api/share/:shareId   — get review by share ID
 */

const express = require('express');
const router = express.Router();
const { generateShareLink, getSharedReview } = require('../controllers/shareController');

router.post('/:reviewId', generateShareLink);
router.get('/:shareId', getSharedReview);

module.exports = router;
