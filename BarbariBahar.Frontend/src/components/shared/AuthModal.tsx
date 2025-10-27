// src/components/shared/AuthModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useOrder, type User } from '../../context/OrderContext';
import OtpLoginForm from './OtpLoginForm'; // Using the reusable component

// Define the missing props interface
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void; // Callback on successful login
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useOrder();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  const handleSuccess = (token: string, user: User) => {
    login(token, user); // Update global context
    onSuccess(user, token); // Execute callback
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
          <X />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
        </h2>

        {/* Use the reusable OtpLoginForm component */}
        <OtpLoginForm
          onSuccess={handleSuccess}
          mode={mode}
          apiEndpoints={{
            sendOtp: '/auth/send-otp',
            verifyOtp: '/auth/verify-otp'
          }}
        />

        <div className="mt-4 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
