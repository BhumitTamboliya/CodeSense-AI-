const Review = require('../models/Review');

const getHistory = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Filter by logged-in user
    const filter = req.user ? { userId: req.user._id } : {};

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit)
        .select('originalCode fileName language qualityScore summary createdAt shareId')
        .lean(),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true, reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
};

const getReviewById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user) filter.userId = req.user._id;
    const review = await Review.findOne(filter).lean();
    if (!review) return res.status(404).json({ error: 'Review not found.' });
    res.json({ success: true, review });
  } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user) filter.userId = req.user._id;
    const review = await Review.findOneAndDelete(filter);
    if (!review) return res.status(404).json({ error: 'Review not found.' });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) { next(error); }
};

const clearHistory = async (req, res, next) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    await Review.deleteMany(filter);
    res.json({ success: true, message: 'History cleared.' });
  } catch (error) { next(error); }
};

module.exports = { getHistory, getReviewById, deleteReview, clearHistory };
