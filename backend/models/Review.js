/**
 * Review Model
 * Stores code review results — linked to user
 */

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // Link to user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  originalCode:   { type: String, required: true },
  fileName:       { type: String, default: null },
  language:       { type: String, default: 'Unknown' },
  qualityScore:   { type: Number, min: 0, max: 100, default: 0 },
  bugs:           { type: [String], default: [] },
  securityIssues: { type: [String], default: [] },
  improvements:   { type: [String], default: [] },
  fixedCode:      { type: String, default: '' },
  explainSimple:  { type: String, default: '' },
  summary:        { type: String, default: '' },
  shareId:        { type: String, unique: true, sparse: true },
}, { timestamps: true });

ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
