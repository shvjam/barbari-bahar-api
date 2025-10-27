// src/pages/admin/AdminLoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Key, LogIn, Loader } from 'lucide-react';
import api from '../../services/api';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'send-otp' | 'verify-otp'>('send-otp');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login-send-otp', { phone });
      setRequestId(response.data.requestId);
      setStep('verify-otp');
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login-verify-otp', { phone, code, requestId });
      const { token, user } = response.data;

      // IMPORTANT: Check if the logged-in user is an Admin
      if (user.role !== 'Admin') {
        setError("شما دسترسی ادمین ندارید.");
        // In a real app, you might want to log them out or handle this differently
        return;
      }

      localStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || "کد وارد شده صحیح نیست.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center font-['Vazirmatn'] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#221896]">ورود به پنل مدیریت</h1>
          <p className="text-gray-500 mt-2">بهار | Bahar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {step === 'send-otp' ? (
          <form onSubmit={handleSendOtp}>
            <div className="relative mb-6">
              <Smartphone className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" />
              <input
                type="tel"
                placeholder="شماره موبایل"
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-[#FF8B06]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#221896] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#001AA8] transition-all disabled:bg-gray-400"
            >
              {loading ? <Loader className="animate-spin" /> : <LogIn />}
              <span>{loading ? 'درحال ارسال...' : 'ارسال کد تایید'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-center mb-4 text-gray-600">کد تایید به شماره {phone} ارسال شد.</p>
            <div className="relative mb-6">
              <Key className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" />
              <input
                type="text"
                placeholder="کد تایید"
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg text-lg text-center tracking-[0.5em] focus:ring-2 focus:ring-[#FF8B06]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:bg-gray-400"
            >
              {loading ? <Loader className="animate-spin" /> : <LogIn />}
              <span>{loading ? 'درحال بررسی...' : 'ورود و تایید کد'}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep('send-otp')}
              className="mt-4 text-sm text-gray-500 hover:text-black"
            >
              ویرایش شماره موبایل
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
