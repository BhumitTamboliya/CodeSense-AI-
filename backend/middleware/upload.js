/**
 * Multer Middleware for File Uploads
 * Supports: .js .py .java .cpp .ts .html .css .go .rb .php files
 */

const multer = require('multer');
const path = require('path');

// Use memory storage — we don't need to persist files to disk
const storage = multer.memoryStorage();

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.cpp', '.c', '.cs',
    '.html', '.css', '.scss',
    '.go', '.rb', '.php', '.swift', '.kt',
    '.rs', '.vue', '.json', '.md', '.txt',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${ext}. Allowed: ${allowedExtensions.join(', ')}`
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 2, // Max 2 files (for compare feature)
  },
});

module.exports = upload;
