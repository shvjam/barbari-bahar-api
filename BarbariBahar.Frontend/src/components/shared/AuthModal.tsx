// src/components/shared/AuthModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Key, User, Loader } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import api from '../../services/api';

// ... (interfaces remain the same)

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useOrder();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'send-otp' | 'verify-otp'>('send-otp');
  const [phone, setPhone] = useState('');
  // ... (other state hooks remain the same)

  // ... (handleSendOtp and handleVerifyOtp logic remains the same)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"><X /></button>
        <h2 className="text-2xl font-bold text-center mb-6">{mode === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}</h2>

        {step === 'send-otp' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode === 'register' && (
              <>
                <input name="firstName" placeholder="نام" className="w-full p-3 border rounded-lg" required />
                <input name="lastName" placeholder="نام خانوادگی" className="w-full p-3 border rounded-lg" required />
              </>
            )}
            <div className="relative">
              <Smartphone className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
              <input type="tel" name="phone" placeholder="شماره موبایل" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pr-10 p-3 border rounded-lg" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#221896] text-white font-bold py-3 rounded-lg flex justify-center items-center">
              {loading ? <Loader className="animate-spin"/> : 'ارسال کد'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-sm">کد ارسال شده به {phone} را وارد کنید.</p>
            <div className="relative">
              <Key className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
              <input type="text" name="code" placeholder="کد تایید" value={code} onChange={e => setCode(e.target.value)} className="w-full pr-10 p-3 border rounded-lg text-center tracking-[0.5em]" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex justify-center items-center">
              {loading ? <Loader className="animate-spin"/> : 'تایید و ورود'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-blue-600 hover:underline">
            {mode === 'login' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
