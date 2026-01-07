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
              <Clock className="text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Link Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Tạo Link Kiếm Coin</h2>
            <p className="text-gray-400">Mỗi tài khoản được tạo 2 link mỗi ngày</p>
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={isLoading || remainingLinks <= 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${remainingLinks > 0 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                : 'bg-gray-700 cursor-not-allowed'
              } transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <LinkIcon size={20} />
            )}
            Tạo Link ({remainingLinks} lượt)
          </button>
        </div>

        <AnimatePresence>
          {generatedLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <h3 className="font-medium text-gray-300">Link đã tạo:</h3>
              {generatedLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <ExternalLink className="text-blue-400" size={18} />
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate max-w-md"
                    >
                      {link}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopyLink(link, index)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={18} />
                        Đã copy
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {remainingLinks <= 0 && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-500" />
              <p className="text-yellow-300">
                Bạn đã hết lượt tạo link hôm nay. Vui lòng quay lại vào 00:00 ngày mai!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit Code Section */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Nhập Mã Code Nhận Coin</h2>
        <p className="text-gray-400 mb-6">
          Sau khi hoàn thành nhiệm vụ trên link, bạn sẽ nhận được một mã code. 
          Nhập mã dưới đây để nhận 5 coins!
        </p>

        <form onSubmit={handleSubmitCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Mã Code
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Nhập mã code bạn nhận được"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Lock size={14} />
            <span>Mỗi mã chỉ sử dụng 1 lần cho 1 tài khoản</span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-[1.02]"
          >
            <Shield size={20} />
            Xác Nhận Nhận Coin
          </button>
        </form>

        {/* Sample Codes */}
        <div className="mt-8">
          <h3 className="font-medium mb-3">Hướng dẫn nhận code:</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="font-medium mb-2">1. Truy cập link đã tạo</p>
              <p className="text-sm text-gray-400">
                Click vào link phía trên và làm theo hướng dẫn trên trang
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="font-medium mb-2">2. Hoàn thành nhiệm vụ</p>
              <p className="text-sm text-gray-400">
                Làm theo các bước trên trang để nhận mã code
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="font-medium mb-2">3. Nhập mã tại đây</p>
              <p className="text-sm text-gray-400">
                Dán mã code vào ô trên và nhận ngay 5 coins!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkBoost;
