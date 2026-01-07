import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Link as LinkIcon, Wallet, Gift, Ticket, 
  History, User, LogOut, Settings, Shield, Users, Package,
  CreditCard, Brain, Search, Send, ChevronRight, Bell,
  TrendingUp, Coins, Gem, Crown, Star, CheckCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LinkBoost from './pages/LinkBoost';
import Withdraw from './pages/Withdraw';
import BrainrotExchange from './pages/BrainrotExchange';
import GiftCode from './pages/GiftCode';
import TicketSystem from './pages/TicketSystem';
import HistoryPage from './pages/HistoryPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';

// Context/Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <MainLayout />
      </AuthProvider>
    </Router>
  );
};

// Main Layout với Menu 3 gạch
const MainLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menu items theo role
  const menuItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard', show: !!user },
    { path: '/link-boost', icon: <LinkIcon size={20} />, label: 'Vượt Link', show: !!user },
    { path: '/withdraw', icon: <Wallet size={20} />, label: 'Rút Coin', show: !!user },
    { path: '/brainrot', icon: <Brain size={20} />, label: 'Brainrot', show: !!user },
    { path: '/giftcode', icon: <Gift size={20} />, label: 'Giftcode', show: !!user },
    { path: '/tickets', icon: <Ticket size={20} />, label: 'Ticket', show: !!user },
    { path: '/history', icon: <History size={20} />, label: 'History', show: !!user },
    { path: '/profile', icon: <User size={20} />, label: 'Hồ Sơ', show: !!user },
    { path: '/admin', icon: <Shield size={20} />, label: 'Admin Panel', show: isAdmin },
  ];

  const filteredMenuItems = menuItems.filter(item => item.show);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile Header với nút menu 3 gạch */}
      <header className="lg:hidden sticky top-0 z-50 bg-gray-800/90 backdrop-blur-md border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-sm font-medium">{user.username}</div>
              <div className="text-xs text-gray-400">{user.coins} coins</div>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getLevelClass(user.level)}`}>
              {user.level}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">EarnRobux</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <nav className="p-4">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-700 mb-2 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-900/30 w-full mt-4 text-red-400"
              >
                <LogOut size={20} />
                <span>Đăng Xuất</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar cố định */}
        <aside className="w-64 h-screen sticky top-0 bg-gray-800/90 backdrop-blur-md border-r border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gem className="text-blue-400" />
              EarnRobux
            </h1>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold">{user.username.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Coins size={12} /> {user.coins} coins
                </div>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                {item.icon}
                <span>{item.label}</span>
                <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <div className={`px-4 py-2 rounded-lg text-center font-bold mb-3 ${getLevelClass(user.level)}`}>
              Cấp độ: {user.level}
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 w-full transition-colors"
            >
              <LogOut size={18} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto h-screen">
          <div className="p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/link-boost" element={<LinkBoost />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/brainrot" element={<BrainrotExchange />} />
              <Route path="/giftcode" element={<GiftCode />} />
              <Route path="/tickets" element={<TicketSystem />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Overlay cho mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

// Hàm helper cho class level
const getLevelClass = (level) => {
  switch(level?.toLowerCase()) {
    case 'đồng': return 'badge-bronze';
    case 'vàng': return 'badge-gold';
    case 'bạch kim': return 'badge-platinum';
    case 'kim cương': return 'badge-diamond';
    default: return 'bg-gray-600';
  }
};

export default App;
