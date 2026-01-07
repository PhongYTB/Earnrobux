import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import CoinTransaction from '../models/CoinTransaction.js';
import keys from '../../keys.json' assert { type: 'json' };

const router = express.Router();

// Sample links pool
const LINK_POOL = [
  'https://link4m.com/6WIfSArs',
  'https://link4m.com/k5rS6rkT',
  'https://link4m.com/aBcDeFgH',
  'https://link4m.com/IjKlMnOp',
  'https://link4m.com/QrStUvWx'
];

// Used codes tracking
const usedCodes = new Set();

// Generate new link
router.post('/generate', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check daily limit
    const today = new Date().toDateString();
    const lastLinkDay = user.lastLinkDate ? new Date(user.lastLinkDate).toDateString() : null;
    
    // Reset counter if new day
    if (lastLinkDay !== today) {
      user.linksToday = 0;
      user.lastLinkDate = new Date();
    }
    
    // Check limit
    if (user.linksToday >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã hết lượt tạo link hôm nay. Vui lòng quay lại vào ngày mai!'
      });
    }
    
    // Generate random link
    const randomIndex = Math.floor(Math.random() * LINK_POOL.length);
    const newLink = LINK_POOL[randomIndex];
    
    // Update user stats
    user.linksToday += 1;
    user.lastLinkDate = new Date();
    await user.save();
    
    res.json({
      success: true,
      link: newLink,
      remainingLinks: 2 - user.linksToday
    });
    
  } catch (error) {
    console.error('Generate link error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify code
router.post('/verify-code', 
  body('code').trim().notEmpty().withMessage('Code is required'),
  
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      
      const { code } = req.body;
      const userId = req.userId;
      
      // Check if code exists in keys
      const validCode = keys.validCodes.find(c => c.code === code);
      
      if (!validCode) {
        return res.status(400).json({
          success: false,
          message: 'Mã code không hợp lệ!'
        });
      }
      
      // Check if code already used by this user
      const existingTransaction = await CoinTransaction.findOne({
        userId,
        description: `Code redemption: ${code}`
      });
      
      if (existingTransaction) {
        return res.status(400).json({
          success: false,
          message: 'Mã code đã được sử dụng!'
        });
      }
      
      // Update user coins
      const user = await User.findById(userId);
      const coinsToAdd = 5;
      
      // Calculate with level discount
      const discount = getLevelDiscount(user.level);
      const finalCoins = Math.floor(coinsToAdd * (1 - discount / 100));
      
      user.coins += finalCoins;
      user.totalCoinsEarned += finalCoins;
      user.completedLinks += 1;
      
      // Check for level upgrade
      await checkLevelUpgrade(user);
      
      await user.save();
      
      // Create transaction log
      const transaction = new CoinTransaction({
        userId: user._id,
        type: 'link_completed',
        amount: finalCoins,
        balanceBefore: user.coins - finalCoins,
        balanceAfter: user.coins,
        description: `Code redemption: ${code}`,
        referenceType: 'Link',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      await transaction.save();
      
      res.json({
        success: true,
        coins: finalCoins,
        message: `+${finalCoins} coins đã được thêm vào tài khoản!`,
        newBalance: user.coins,
        level: user.level,
        discountApplied: discount
      });
      
    } catch (error) {
      console.error('Verify code error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

// Get link stats
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const today = new Date().toDateString();
    const lastLinkDay = user.lastLinkDate ? new Date(user.lastLinkDate).toDateString() : null;
    
    let linksToday = user.linksToday;
    if (lastLinkDay !== today) {
      linksToday = 0;
    }
    
    res.json({
      success: true,
      linksToday,
      remainingLinks: Math.max(0, 2 - linksToday),
      lastLinkDate: user.lastLinkDate,
      completedLinks: user.completedLinks
    });
    
  } catch (error) {
    console.error('Get link stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Helper functions
function getLevelDiscount(level) {
  switch(level) {
    case 'đồng': return 0;
    case 'vàng': return 5;
    case 'bạch kim': return 10;
    case 'kim cương': return 15;
    default: return 0;
  }
}

async function checkLevelUpgrade(user) {
  const oldLevel = user.level;
  
  if (user.completedLinks >= 50 && user.level !== 'kim cương') {
    user.level = 'kim cương';
  } else if (user.completedLinks >= 10 && user.level === 'đồng') {
    user.level = 'vàng';
  } else if (user.completedLinks >= 50 && user.level === 'vàng') {
    user.level = 'bạch kim';
  }
  
  if (oldLevel !== user.level) {
    // Log level upgrade
    console.log(`User ${user.username} upgraded from ${oldLevel} to ${user.level}`);
  }
}

export default router;
