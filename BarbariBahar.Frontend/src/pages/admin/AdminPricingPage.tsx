// src/pages/admin/AdminPricingPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Loader, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import PricingFactorFormModal from '../../components/admin/PricingFactorFormModal';

interface PricingFactor {
  id: number;
  name: string;
  price: number;
  unit: string;
  serviceCategoryId: number;
  serviceCategoryName: string;
}

interface ServiceCategory {
  id: number;
  name: string;
}

const AdminPricingPage: React.FC = () => {
  const [factors, setFactors] = useState<PricingFactor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [factorToEdit, setFactorToEdit] = useState<Partial<PricingFactor> | null>(null);

  const fetchCategories = async () => {
    try {
      const catResponse = await api.get<ServiceCategory[]>('/order/servicecategories');
      setCategories(catResponse.data);
      if (catResponse.data.length > 0 && activeCategory === null) {
        setActiveCategory(catResponse.data[0].id);
      } else if (catResponse.data.length === 0) {
        setLoading(false);
      }
    } catch {
      setError('خطا در دریافت دسته‌بندی‌ها.');
      setLoading(false);
    }
  };

  const fetchFactors = async () => {
    if (activeCategory === null) return;
    setLoading(true);
    try {
      const response = await api.get<PricingFactor[]>('/pricingfactors', {
        params: { serviceCategoryId: activeCategory }
      });
      setFactors(response.data);
    } catch {
      setError('خطا در دریافت عوامل قیمت‌گذاری.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFactors();
  }, [activeCategory]);

  const handleOpenModal = (factor: Partial<PricingFactor> | null = null) => {
    setFactorToEdit(factor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFactorToEdit(null);
  };

  const handleSaveFactor = async (factorData: Partial<PricingFactor>) => {
    try {
      if (factorData.id) {
        await api.put(`/pricingfactors/${factorData.id}`, factorData);
      } else {
        await api.post('/pricingfactors', { ...factorData, serviceCategoryId: activeCategory });
      }
      handleCloseModal();
      fetchFactors();
    } catch {
      alert('خطا در ذخیره سازی.');
    }
  };

  const handleDeleteFactor = async (factorId: number) => {
    if (window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      try {
        await api.delete(`/pricingfactors/${factorId}`);
        fetchFactors();
      } catch {
        alert('خطا در حذف.');
      }
    }
  };

  if (error && !loading) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">مدیریت قیمت‌گذاری</h2>
        <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
          <PlusCircle size={20} />
          <span>افزودن عامل جدید</span>
        </button>
      </div>

      <div className="flex border-b-2 border-gray-200 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`py-3 px-6 text-lg font-semibold transition-all duration-300 ${activeCategory === cat.id ? 'border-b-4 border-[#FF8B06] text-[#221896]' : 'text-gray-500 hover:text-[#001AA8]'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-[#221896]" size={48} /></div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="py-3 px-4">نام عامل</th>
                <th className="py-3 px-4">قیمت</th>
                <th className="py-3 px-4">واحد</th>
                <th className="py-3 px-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {factors.map(factor => (
                <tr key={factor.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{factor.name}</td>
                  <td className="py-3 px-4">{factor.price.toLocaleString('fa-IR')} تومان</td>
                  <td className="py-3 px-4">{factor.unit}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(factor)} className="text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                      <button onClick={() => handleDeleteFactor(factor.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PricingFactorFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFactor}
        factorToEdit={factorToEdit}
        categories={categories}
      />
    </motion.div>
  );
};

export default AdminPricingPage;
