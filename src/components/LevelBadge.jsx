import React from 'react';
import { Crown, Star, Gem, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const LevelBadge = ({ level, showIcon = true, size = 'md' }) => {
  const levelConfig = {
    'đồng': {
      icon: <Award className="text-yellow-800" />,
      color: 'bronze',
      gradient: 'from-yellow-800 to-yellow-600',
      name: 'Đồng'
    },
    'vàng': {
      icon: <Star className="text-yellow-300" />,
      color: 'gold',
      gradient: 'from-yellow-500 to-yellow-300',
      name: 'Vàng'
    },
    'bạch kim': {
      icon: <Gem className="text-gray-300" />,
      color: 'platinum',
      gradient: 'from-gray-300 to-gray-100',
      name: 'Bạch Kim'
    },
    'kim cương': {
      icon: <Crown className="text-cyan-300" />,
      color: 'diamond',
      gradient: 'from-cyan-300 to-blue-200',
      name: 'Kim Cương'
    }
  };

  const config = levelConfig[level?.toLowerCase()] || levelConfig['đồng'];

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-2 rounded-full font-bold
        bg-gradient-to-r ${config.gradient}
        ${sizes[size]}
        ${level === 'kim cương' ? 'pulse-glow' : ''}
        shadow-lg
      `}
    >
      {showIcon && <span>{config.icon}</span>}
      <span className={level === 'vàng' || level === 'bạch kim' ? 'text-gray-900' : 'text-white'}>
        {config.name}
      </span>
    </motion.div>
  );
};

export default LevelBadge;
