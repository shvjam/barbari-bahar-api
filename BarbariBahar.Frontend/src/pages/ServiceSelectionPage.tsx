// src/pages/ServiceSelectionPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Box, Users } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const ServiceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setServiceType } = useOrder();

  const handleSelectService = (serviceType: 'Moving' | 'Packing') => {
    setServiceType(serviceType);
    if (serviceType === 'Moving') {
      navigate('/order/moving-details');
    } else if (serviceType === 'Packing') {
      navigate('/order/products');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-['Vazirmatn'] p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-[#221896] sm:text-5xl">به بهار خوش آمدید</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
          چه خدمتی برای شما انجام دهیم؟
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="اسباب‌کشی و حمل بار"
          description="حمل و نقل ایمن و سریع با انواع کامیون و کارگران مجرب."
          icon={<Truck size={48} className="text-white" />}
          onClick={() => handleSelectService('Moving')}
        />
        <ServiceCard
          title="خرید محصولات بسته‌بندی"
          description="انواع کارتن، نایلون حباب‌دار و سایر ملزومات."
          icon={<Box size={48} className="text-white" />}
          onClick={() => handleSelectService('Packing')}
        />
        <ServiceCard
          title="درخواست کارگر"
          description="نیروی کار حرفه‌ای برای جابجایی و سایر امور."
          icon={<Users size={48} className="text-white" />}
          onClick={() => { /* Navigate to labor page - TBD */ }}
          disabled
        />
      </div>
    </div>
  );
};

// --- ServiceCard Component ---
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, onClick, disabled }) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    transition={{ duration: 0.3 }}
    onClick={!disabled ? onClick : undefined}
    className={`bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className="mx-auto bg-[#221896] rounded-full h-20 w-20 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
    {!disabled && <div className="mt-6 text-sm font-semibold text-[#FF8B06]">انتخاب سرویس</div>}
  </motion.div>
);

export default ServiceSelectionPage;
