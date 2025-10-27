// src/components/admin/ProductFormModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Product } from '../../context/OrderContext';
import type { Category } from '../../context/OrderContext'; // Assuming Category is exported

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
  categories: Category[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
  const [product, setProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({ name: '', description: '', price: 0, categoryId: categories[0]?.id });
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'categoryId' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product as Product);
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
        <h2 className="text-2xl font-bold mb-6">{productToEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام محصول</label>
            <input type="text" name="name" id="name" value={product.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
            <textarea name="description" id="description" value={product.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">قیمت (تومان)</label>
            <input type="number" name="price" id="price" value={product.price || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">دسته بندی</label>
            <select name="categoryId" id="categoryId" value={product.categoryId || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
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

export default ProductFormModal;
