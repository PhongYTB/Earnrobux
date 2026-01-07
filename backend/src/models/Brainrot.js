import mongoose from 'mongoose';

const brainrotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  
  // Brainrot details
  itemName: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    enum: ['fixed', 'random', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'combinasion',
      'random_brainrot',
      'vehicle',
      'mobilis',
      'school',
      'keletang',
      'sahur'
    ]
  },
  
  // Pricing
  coinCost: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  finalCost: {
    type: Number,
    required: true
  },
  
  // Roblox account
  robloxUsername: {
    type: String,
    required: true
  },
  robloxPassword: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Processing
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  
  // Admin notes
  adminNotes: String,
  petAdded: Boolean,
  petId: String,
  
  timestamps: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }
});

const Brainrot = mongoose.model('Brainrot', brainrotSchema);
export default Brainrot;
