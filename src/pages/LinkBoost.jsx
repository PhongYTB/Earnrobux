import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, Copy, Check, Clock, AlertCircle,
  RefreshCw, ExternalLink, Lock, Shield
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LinkBoost = () => {
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [remainingLinks, setRemainingLinks] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sampleLinks = [
    'https://link4m.com/6WIfSArs',
    'https://link4m.com/k5rS6rkT'
  ];

  const handleGenerateLink = async () => {
    if (remainingLinks <= 0) {
      toast.error('Bạn đã hết lượt vượt link hôm nay!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/links/generate');
      const newLink = response.data.link;
      
      setGeneratedLinks(prev => [...prev, newLink]);
      setRemainingLinks(prev => prev - 1);
      
      toast.success('Đã tạo link thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (link, index) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    toast.success('Đã sao chép link!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      toast.error('Vui lòng nhập mã code');
      return;
    }

    try {
      const response = await api.post('/links/verify-code', { code: codeInput });
      toast.success(`+${response.data.coins} coins đã được cộng!`);
      setCodeInput('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mã code không hợp lệ');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Vượt Link Kiếm Coin</h1>
        <p className="text-gray-400">Tạo link, hoàn thành nhiệm vụ, nhập code nhận coin</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Link còn lại hôm nay</p>
              <p className="text-3xl font-bold mt-1">{remainingLinks}/2</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20">
              <LinkIcon className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Coin nhận được/link</p>
              <p className="text-3xl font-bold mt-1">5 coins</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/20">
              <Shield className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Reset sau</p>
              <p className="text-3xl font-bold mt-1">00:00</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/20">
              <Clock className="text-purple-400" size
