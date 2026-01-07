import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Coins, Link as LinkIcon, Package, 
  Users, Gift, BarChart3, Clock, Target,
  Zap, Shield, ChevronUp, Award
} from 'lucide-react';
import LevelBadge from '../components/LevelBadge';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayCoins: 0,
    todayLinks: 0,
    totalWithdrawn: 0,
    completedLinks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
      
      const activity = await api.get('/user/activity');
      setRecentActivity(activity.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: 'Coin Hiện Có',
      value: user?.coins || 0,
      icon: <Coins className="text-yellow-400" />,
      change: '+5.2%',
      color: 'from-yellow-500/20 to-yellow-600/20'
    },
    {
      title: 'Coin Hôm Nay',
      value: stats.todayCoins,
      icon: <TrendingUp className="text-emerald-400" />,
      change: `+${stats.todayLinks * 5}`,
      color: 'from-emerald-500/20 to-emerald-600/20'
    },
    {
      title: 'Link Đã Vượt',
      value: stats.todayLinks,
      icon: <LinkIcon className="text-blue-400" />,
      change: '/2',
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Robux Đã Đổi',
      value: `${stats.totalWithdrawn} R$`,
      icon: <Package className="text-purple-400" />,
      change: 'Đang chờ: 0',
      color: 'from-purple-500/20 to-purple-600/20'
    }
  ];

  const levelProgress = {
    'đồng': { required: 0, current: user?.completedLinks || 0, next: 'Vàng' },
    'vàng': { required: 10, current: user?.completedLinks || 0, next: 'Bạch Kim' },
    'bạch kim': { required: 50, current: user?.completedLinks || 0, next: 'Kim Cương' },
    'kim cương': { required: 100, current: user?.completedLinks || 0, next: null }
  };

  const currentLevel = user?.level || 'đồng';
  const progress = levelProgress[currentLevel];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Chào mừng trở lại, {user?.username}!</p>
        </div>
        <LevelBadge level={user?.level} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-gray-800/50">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-300">{stat.change}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="text-yellow-500" />
              Tiến Trình Cấp Độ
            </h2>
            <span className="text-sm text-gray-400">
              {progress.current}/{progress.required || '∞'} link
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Cấp độ hiện tại</span>
              <span className="font-bold">{currentLevel.toUpperCase()}</span>
            </div>
            
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((progress.current / progress.required) * 100, 100)}%` }}
                className={`h-full rounded-full ${getLevelColor(currentLevel)}`}
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {progress.next ? `Cần ${progress.required - progress.current} link để lên ${progress.next}` : 'Đã đạt cấp cao nhất'}
              </span>
              {progress.next && (
                <span className="text-blue-400 flex items-center gap-1">
                  <ChevronUp size={16} />
                  {progress.next}
                </span>
              )}
            </div>
          </div>

          {/* Level Benefits */}
          <div className="mt-8">
            <h3 className="font-medium mb-3">Đặc quyền cấp độ:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Giảm {getDiscount(currentLevel)}% coin khi đổi vật phẩm
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Ưu tiên hỗ trợ ticket
              </li>
              {currentLevel === 'kim cương' && (
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Truy cập tính năng đặc biệt
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-gray-400" />
            Hoạt Động Gần Đây
          </h2>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${activity.coins > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.coins > 0 ? '+' : ''}{activity.coins} coins
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Hành Động Nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02]">
            <Zap size={20} />
            <span>Vượt Link Ngay</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-[1.02]">
            <Gift size={20} />
            <span>Nhập Giftcode</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02]">
            <Users size={20} />
            <span>Tặng Coin Bạn Bè</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getLevelColor = (level) => {
  switch(level?.toLowerCase()) {
    case 'đồng': return 'bg-gradient-to-r from-yellow-800 to-yellow-600';
    case 'vàng': return 'bg-gradient-to-r from-yellow-500 to-yellow-300';
    case 'bạch kim': return 'bg-gradient-to-r from-gray-300 to-gray-100';
    case 'kim cương': return 'bg-gradient-to-r from-cyan-300 to-blue-200';
    default: return 'bg-gray-600';
  }
};

const getDiscount = (level) => {
  switch(level?.toLowerCase()) {
    case 'đồng': return 0;
    case 'vàng': return 5;
    case 'bạch kim': return 10;
    case 'kim cương': return 15;
    default: return 0;
  }
};

const getActivityIcon = (type) => {
  switch(type) {
    case 'link': return <LinkIcon size={16} />;
    case 'withdraw': return <Package size={16} />;
    case 'gift': return <Gift size={16} />;
    case 'brainrot': return <Shield size={16} />;
    default: return <Coins size={16} />;
  }
};

const getActivityColor = (type) => {
  switch(type) {
    case 'link': return 'bg-blue-500/20 text-blue-400';
    case 'withdraw': return 'bg-purple-500/20 text-purple-400';
    case 'gift': return 'bg-emerald-500/20 text-emerald-400';
    case 'brainrot': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export default Dashboard;
