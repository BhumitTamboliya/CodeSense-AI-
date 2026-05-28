const { reviewCode } = require('./aiService');
const Review = require('../models/Review');

const reviewPaste = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Please provide code to review.' });
    const trimmed = code.trim();
    if (trimmed.length < 5)     return res.status(400).json({ error: 'Code is too short.' });
    if (trimmed.length > 50000) return res.status(400).json({ error: 'Code too long. Max 50,000 characters.' });

    const reviewResult = await reviewCode(trimmed);

    let savedReview = null;
    try {
      savedReview = await Review.create({
        originalCode: trimmed,
        userId: req.user?._id || null,
        ...reviewResult
      });
    } catch (e) { console.warn('[DB]', e.message); }

    res.json({ success: true, reviewId: savedReview?._id || null, ...reviewResult });
  } catch (error) { next(error); }
};

const reviewUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const code = req.file.buffer.toString('utf-8');
    const fileName = req.file.originalname;
    if (code.trim().length < 5) return res.status(400).json({ error: 'File is empty.' });

    const reviewResult = await reviewCode(code.trim());

    let savedReview = null;
    try {
      savedReview = await Review.create({
        originalCode: code.trim(),
        fileName,
        userId: req.user?._id || null,
        ...reviewResult
      });
    } catch (e) { console.warn('[DB]', e.message); }

    res.json({ success: true, reviewId: savedReview?._id || null, fileName, ...reviewResult });
  } catch (error) { next(error); }
};

module.exports = { reviewPaste, reviewUpload };
