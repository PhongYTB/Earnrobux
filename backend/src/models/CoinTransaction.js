import mongoose from 'mongoose';

const coinTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'link_completed',
      'withdraw',
      'gift_sent',
      'gift_received',
      'giftcode_redeemed',
      'brainrot_purchase',
      'admin_added',
      'admin_removed',
      'refund',
      'penalty'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  description: String,
  
  // Reference to related entity
  referenceId: mongoose.Schema.Types.ObjectId,
  referenceType: {
    type: String,
    enum: ['Link', 'Withdraw', 'GiftCode', 'Brainrot', 'Ticket', 'User']
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for fast queries
coinTransactionSchema.index({ userId: 1, timestamp: -1 });
coinTransactionSchema.index({ type: 1 });
coinTransactionSchema.index({ referenceId: 1 });

const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema);
export default CoinTransaction;
