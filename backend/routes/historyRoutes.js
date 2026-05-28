/**
 * History Routes
 * GET    /api/history       — get all reviews (paginated)
 * GET    /api/history/:id   — get single review
 * DELETE /api/history/:id   — delete a review
 * DELETE /api/history       — clear all history
 */

const express = require('express');
const router = express.Router();
const {
  getHistory,
  getReviewById,
  deleteReview,
  clearHistory,
} = require('../controllers/historyController');

router.get('/', getHistory);
router.get('/:id', getReviewById);
router.delete('/', clearHistory);
router.delete('/:id', deleteReview);

module.exports = router;
