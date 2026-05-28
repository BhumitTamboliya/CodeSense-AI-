/**
 * OTP Controller
 * Handles email OTP generation, sending, and verification
 */

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory OTP store — { email: { otp, expiresAt } }
const otpStore = new Map();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * POST /api/otp/send
 * Generate and send OTP to email
 */
const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Send email
    await transporter.sendMail({
      from: `"CodeSense AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CodeSense AI Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #07040f; color: #e2e8f0; padding: 32px; border-radius: 16px; border: 1px solid rgba(168,85,247,0.2);">
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="color: #a855f7; font-size: 24px; margin: 0;">⟨/⟩ CodeSense AI</h1>
          </div>
          <h2 style="font-size: 20px; margin-bottom: 12px; color: #ffffff;">Verify your email</h2>
          <p style="color: #888; margin-bottom: 24px; line-height: 1.6;">
            Use the code below to complete your signup. This code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.
          </p>
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #a855f7; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #555; font-size: 13px; text-align: center;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent successfully! Check your email.' });
  } catch (error) {
    console.error('[OTP] Send error:', error.message);
    next(error);
  }
};

/**
 * POST /api/otp/verify
 * Verify OTP entered by user
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (stored.otp !== otp.toString()) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    // OTP verified — delete from store
    otpStore.delete(email.toLowerCase());

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendOTP, verifyOTP };
