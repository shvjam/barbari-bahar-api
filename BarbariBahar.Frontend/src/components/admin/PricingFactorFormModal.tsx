// src/components/admin/PricingFactorFormModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Re-using types defined in the page
interface PricingFactor {
  id?: number;
  name: string;
  price: number;
  unit: string;
  serviceCategoryId: number;
}

interface ServiceCategory {
  id: number;
  name: string;
}

interface PricingFactorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (factor: PricingFactor) => void;
  factorToEdit: Partial<PricingFactor> | null;
  categories: ServiceCategory[];
}

const PricingFactorFormModal: React.FC<PricingFactorFormModalProps> = ({ isOpen, onClose, onSave, factorToEdit, categories }) => {
  const [factor, setFactor] = useState<Partial<PricingFactor>>({});

  useEffect(() => {
    if (factorToEdit) {
      setFactor(factorToEdit);
    } else {
      setFactor({ name: '', price: 0, unit: '', serviceCategoryId: categories[0]?.id });
    }
  }, [factorToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFactor(prev => ({ ...prev, [name]: name === 'price' || name === 'serviceCategoryId' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(factor as PricingFactor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">{factorToEdit?.id ? 'ویرایش عامل قیمت‌گذاری' : 'افزودن عامل جدید'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام عامل</label>
            <input type="text" name="name" id="name" value={factor.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">قیمت (تومان)</label>
            <input type="number" name="price" id="price" value={factor.price || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">واحد</label>
            <input type="text" name="unit" id="unit" value={factor.unit || ''} onChange={handleChange} placeholder="مثال: کیلومتر، عدد، ساعت" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label htmlFor="serviceCategoryId" className="block text-sm font-medium text-gray-700">دسته بندی سرویس</label>
            <select name="serviceCategoryId" id="serviceCategoryId" value={factor.serviceCategoryId || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">لغو</button>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">ذخیره</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PricingFactorFormModal;
