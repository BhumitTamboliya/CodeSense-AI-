/**
 * Share Controller
 * Generates and resolves shareable links for reviews
 */

const { v4: uuidv4 } = require('uuid');
const Review = require('../models/Review');

/**
 * POST /api/share/:reviewId
 * Generate a shareable link for a review
 */
const generateShareLink = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    // If already has a shareId, return existing link
    if (review.shareId) {
      return res.json({
        success: true,
        shareId: review.shareId,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${review.shareId}`,
      });
    }

    // Generate a short unique ID for the share link
    const shareId = uuidv4().replace(/-/g, '').substring(0, 12);
    review.shareId = shareId;
    await review.save();

    res.json({
      success: true,
      shareId,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${shareId}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/share/:shareId
 * Retrieve a review by its share ID
 */
const getSharedReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ shareId: req.params.shareId }).lean();

    if (!review) {
      return res.status(404).json({ error: 'Shared review not found or link expired.' });
    }

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateShareLink, getSharedReview };
