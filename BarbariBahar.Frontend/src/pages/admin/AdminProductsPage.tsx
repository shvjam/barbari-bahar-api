// src/pages/admin/AdminProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Loader, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import type { Product, Category } from '../../context/OrderContext';
import ProductFormModal from '../../components/admin/ProductFormModal';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodResponse, catResponse] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Category[]>('/packagingproductcategories'),
      ]);
      setProducts(prodResponse.data);
      setCategories(catResponse.data);
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت اطلاعات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenModal = (product: Product | null = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      if (productData.id) { // Edit existing product
        await api.put(`/products/${productData.id}`, productData);
      } else { // Create new product
        await api.post('/products', productData);
      }
      handleCloseModal();
      fetchProductsAndCategories(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره سازی محصول.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if(window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProductsAndCategories(); // Refresh data
      } catch (err) {
        console.error(err);
        alert('خطا در حذف محصول.');
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'ناشناخته';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-[#221896]" size={48} /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">مدیریت محصولات</h2>
        <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
          <PlusCircle size={20} />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-right">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="py-3 px-4">نام محصول</th>
              <th className="py-3 px-4">دسته بندی</th>
              <th className="py-3 px-4">قیمت</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{getCategoryName(product.categoryId)}</td>
                <td className="py-3 px-4">{product.price.toLocaleString('fa-IR')} تومان</td>
                <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />
    </motion.div>
  );
};

export default AdminProductsPage;
