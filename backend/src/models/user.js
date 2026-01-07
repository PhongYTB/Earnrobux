import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return !this.oauthId; }
  },
  displayName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // OAuth
  oauthProvider: {
    type: String,
    enum: ['google', 'discord', null],
    default: null
  },
  oauthId: String,
  
  // Coin System
  coins: {
    type: Number,
    default: 0
  },
  totalCoinsEarned: {
    type: Number,
    default: 0
  },
  totalCoinsSpent: {
    type: Number,
    default: 0
  },
  
  // Level System
  level: {
    type: String,
    enum: ['đồng', 'vàng', 'bạch kim', 'kim cương'],
    default: 'đồng'
  },
  completedLinks: {
    type: Number,
    default: 0
  },
  linksToday: {
    type: Number,
    default: 0
  },
  lastLinkDate: {
    type: Date,
    default: null
  },
  
  // Social
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Admin
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'superadmin'],
    default: 'user'
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  
  // Stats
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  totalGifted: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  
  // Activity
  lastLogin: Date,
  lastActivity: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin' || this.role === 'superadmin';
};

// Update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to reset daily links
userSchema.statics.resetDailyLinks = async function() {
  await this.updateMany(
    {},
    { 
      $set: { linksToday: 0, lastLinkDate: null }
    }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
