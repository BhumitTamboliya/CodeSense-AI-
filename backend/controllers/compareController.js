/**
 * Compare Controller
 * Handles side-by-side comparison of two code files
 */

const { compareCode } = require('./aiService');

const compareTwoFiles = async (req, res, next) => {
  try {
    let code1, code2, name1, name2;

    if (req.files && req.files.length === 2) {
      code1 = req.files[0].buffer.toString('utf-8');
      code2 = req.files[1].buffer.toString('utf-8');
      name1 = req.files[0].originalname;
      name2 = req.files[1].originalname;
    } else if (req.body.code1 && req.body.code2) {
      code1 = req.body.code1;
      code2 = req.body.code2;
      name1 = req.body.name1 || 'File 1';
      name2 = req.body.name2 || 'File 2';
    } else {
      return res.status(400).json({ error: 'Please provide two files to compare.' });
    }

    if (code1.trim().length < 5 || code2.trim().length < 5)
      return res.status(400).json({ error: 'Both files must contain code.' });
    if (code1.length > 30000 || code2.length > 30000)
      return res.status(400).json({ error: 'Files too large. Max 30,000 characters each.' });

    const result = await compareCode(code1.trim(), code2.trim(), name1, name2);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = { compareTwoFiles };
