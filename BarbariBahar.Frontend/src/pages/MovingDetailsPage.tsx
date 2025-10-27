// src/pages/MovingDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useOrder, type PricingFactor } from '../context/OrderContext';

interface ServiceCategory {
  id: number;
  name: string;
}

const MovingDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pricingFactorIds, togglePricingFactor } = useOrder();
  const [factors, setFactors] = useState<PricingFactor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [factorsRes, categoriesRes] = await Promise.all([
          api.get<PricingFactor[]>('/pricingfactors'),
          api.get<ServiceCategory[]>('/order/servicecategories'),
        ]);
        setFactors(factorsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError('خطا در دریافت اطلاعات خدمات.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNextStep = () => {
    navigate('/order/address');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-[#221896]" size={48} /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn'] pb-28">
      <header className="bg-[#221896] text-white text-center p-8 shadow-lg">
        <h1 className="text-4xl font-bold">انتخاب جزئیات اسباب‌کشی</h1>
        <p className="mt-2 text-lg opacity-90">خدمات مورد نیاز خود را مشخص کنید</p>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          {categories.map(category => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 pb-3 mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {factors.filter(f => f.serviceCategoryId === category.id).map(factor => (
                  <label key={factor.id} className="flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-gray-100">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-[#FF8B06] focus:ring-[#FF8B06]"
                      checked={pricingFactorIds.includes(factor.id)}
                      onChange={() => togglePricingFactor(factor.id)}
                    />
                    <span className="text-lg text-gray-700">{factor.name}</span>
                    <span className="text-md text-gray-500 mr-auto">({factor.price.toLocaleString('fa-IR')} تومان)</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-2">
        <div className="container mx-auto flex justify-end items-center">
          <button
            onClick={handleNextStep}
            disabled={pricingFactorIds.length === 0}
            className="bg-[#221896] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-[#001AA8] transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400"
          >
            <span>ادامه</span>
            <ArrowLeft size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MovingDetailsPage;
