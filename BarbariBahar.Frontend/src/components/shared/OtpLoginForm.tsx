// src/components/shared/OtpLoginForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Key, LogIn, Loader } from 'lucide-react';
import api from '../../services/api';
import type { User } from '../../context/OrderContext'; // Import the User type

interface OtpLoginFormProps {
  onSuccess: (token: string, user: User) => void;
  mode: 'login' | 'register';
  apiEndpoints: {
    sendOtp: string;
    verifyOtp: string;
  };
}

const OtpLoginForm: React.FC<OtpLoginFormProps> = ({ onSuccess, mode, apiEndpoints }) => {
  const [step, setStep] = useState<'send-otp' | 'verify-otp'>('send-otp');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState(''); // Request ID can be a string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = mode === 'register' ? { ...formState, phone } : { phone };
      const response = await api.post(apiEndpoints.sendOtp, payload);
      setRequestId(response.data.requestId); // Assuming API returns requestId
      setStep('verify-otp');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? (err as any).response?.data?.message : 'خطا در ارسال کد';
      setError(errorMsg || "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(apiEndpoints.verifyOtp, { phone, code, requestId });
      const { token, user } = response.data;
      onSuccess(token, user);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? (err as any).response?.data?.message : 'کد وارد شده صحیح نیست.';
      setError(errorMsg || "کد وارد شده صحیح نیست.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
          {error}
        </div>
      )}

      {step === 'send-otp' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === 'register' && (
            <>
              <input name="firstName" placeholder="نام" onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
              <input name="lastName" placeholder="نام خانوادگی" onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
            </>
          )}
          <div className="relative">
            <Smartphone className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
            <input
              type="tel"
              placeholder="شماره موبایل"
              className="w-full pr-10 p-3 border rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#221896] text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? <Loader className="animate-spin"/> : 'ارسال کد'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-center text-sm text-gray-600">کد تایید به شماره {phone} ارسال شد.</p>
          <div className="relative">
            <Key className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
            <input
              type="text"
              placeholder="کد تایید"
              className="w-full pr-10 p-3 border rounded-lg text-center tracking-[0.3em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex justify-center items-center"
          >
            {loading ? <Loader className="animate-spin"/> : 'تایید و ورود'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default OtpLoginForm;
