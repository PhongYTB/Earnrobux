import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import session from 'express-session';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import linkRoutes from './routes/links.js';
import coinRoutes from './routes/coins.js';
import withdrawRoutes from './routes/withdraw.js';
import brainrotRoutes from './routes/brainrot.js';
import giftcodeRoutes from './routes/giftcodes.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';

// Import middlewares
import { authenticate } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'earnrobux-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
import './config/passport.js';

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/earnrobux', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/links', authenticate, linkRoutes);
app.use('/api/coins', authenticate, coinRoutes);
app.use('/api/withdraw', authenticate, withdrawRoutes);
app.use('/api/brainrot', authenticate, brainrotRoutes);
app.use('/api/giftcodes', authenticate, giftcodeRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});
