// src/pages/OrderConfirmationPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center text-center font-['Vazirmatn'] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-lg"
      >
        <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800">سفارش شما ثبت شد!</h1>
        <p className="text-lg text-gray-600 mt-4">
          از اعتماد شما سپاسگزاریم. می‌توانید وضعیت سفارش خود را از پنل کاربری پیگیری کنید.
        </p>
        <Link to="/" className="mt-8 inline-block bg-[#221896] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#001AA8] transition-colors">
          بازگشت به صفحه اصلی
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;
