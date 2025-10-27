// src/pages/ServiceSelectionPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Box, Users } from 'lucide-react';
import ServiceCard from '../components/shared/ServiceCard'; // Import the shared component

const ServiceSelectionPage: React.FC = () => {

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-100 flex flex-col items-center justify-center font-['Vazirmatn'] p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">به بهار خوش آمدید</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
          چه خدمتی برای شما انجام دهیم?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="اسباب‌کشی و حمل بار"
          description="حمل و نقل ایمن و سریع با انواع کامیون و کارگران مجرب."
          icon={<Truck size={48} className="text-white" />}
          serviceType="Moving"
          path="/order/moving-details"
        />
        <ServiceCard
          title="خرید محصولات بسته‌بندی"
          description="انواع کارتن، نایلون حباب‌دار و سایر ملزومات."
          icon={<Box size={48} className="text-white" />}
          serviceType="Packing"
          path="/order/products"
        />
        <ServiceCard
          title="درخواست کارگر"
          description="نیروی کار حرفه‌ای برای جابجایی و سایر امور."
          icon={<Users size={48} className="text-white" />}
          serviceType="Labor"
          path="/order/labor-details" // Assuming a future path
        />
      </div>
    </div>
  );
};

export default ServiceSelectionPage;
