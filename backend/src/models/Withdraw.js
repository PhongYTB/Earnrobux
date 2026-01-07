import mongoose from 'mongoose';

const withdrawSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  
  // Robux Withdrawal
  robuxAmount: {
    type: Number,
    required: true,
    min: 40
  },
  coinCost: {
    type: Number,
    required: true
  },
  gamepassLink: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: mongoose.Schema.Types.ObjectId,
    reason: String,
    timestamp: Date
  }],
  
  // Processing
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  rejectionReason: String,
  
  // Estimated time
  estimatedCompletion: {
    type: Date,
    default: () => new Date(Date.now() + 120 * 60 * 60 * 1000) // 120 hours
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  timestamps: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }
});

// Update timestamp
withdrawSchema.pre('save', function(next) {
  this.timestamps.updatedAt = new Date();
  next();
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);
export default Withdraw;
