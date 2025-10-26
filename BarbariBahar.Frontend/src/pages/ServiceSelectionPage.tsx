import React from 'react';
import ServiceCard from '../components/shared/ServiceCard';
import { Truck, Box, User } from 'lucide-react';

const ServiceSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          خدمات ما
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          بهترین و سریع‌ترین خدمات حمل و نقل را با ما تجربه کنید.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ServiceCard
          title="اسباب‌کشی و حمل بار"
          description="حمل و نقل ایمن و سریع اثاثیه منزل و کالاهای تجاری شما."
          icon={<Truck size={48} />}
          serviceType="shipping"
        />
        <ServiceCard
          title="خرید محصولات بسته‌بندی"
          description="انواع کارتن، نایلون حباب‌دار و سایر ملزومات بسته‌بندی."
          icon={<Box size={48} />}
          serviceType="packing"
        />
        <ServiceCard
          title="درخواست کارگر"
          description="نیروی کار مجرب و حرفه‌ای برای جابجایی و بسته‌بندی."
          icon={<User size={48} />}
          serviceType="labor"
        />
      </div>
    </div>
  );
};

export default ServiceSelectionPage;
