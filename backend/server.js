require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const mongoose   = require('mongoose');

const reviewRoutes  = require('./routes/reviewRoutes');
const historyRoutes = require('./routes/historyRoutes');
const shareRoutes   = require('./routes/shareRoutes');
const compareRoutes = require('./routes/compareRoutes');
const otpRoutes     = require('./routes/otpRoutes');
const authRoutes    = require('./routes/authRoutes');
const errorHandler  = require('./middleware/errorHandler');
const { optionalAuth } = require('./middleware/authMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
const reviewLimiter  = rateLimit({ windowMs: 15*60*1000, max: 20, message: { error: 'Too many requests. Please wait.' } });

app.use('/api/', generalLimiter);
app.use('/api/review',  reviewLimiter);
app.use('/api/compare', reviewLimiter);

// Optional auth on all routes (attaches user if token present)
app.use(optionalAuth);

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/review',  reviewRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/share',   shareRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/otp',     otpRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'CodeSense AI Backend running' }));

app.use(errorHandler);

// MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB failed: ${error.message} — running without DB`);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CodeSense AI Backend running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
  });
});
