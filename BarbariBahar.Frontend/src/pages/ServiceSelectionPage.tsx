// src/pages/ServiceSelectionPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, ArrowLeft, Plus } from 'lucide-react';
import api from '../services/api';
import { useOrder, Product, Category } from '../context/OrderContext';

const ServiceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, getCartTotal } = useOrder();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, prodResponse] = await Promise.all([
          api.get<Category[]>('/packagingproductcategories'),
          api.get<Product[]>('/products')
        ]);
        setCategories(catResponse.data);
        setProducts(prodResponse.data);
        if (catResponse.data.length > 0) {
          setSelectedCategory(catResponse.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNextStep = () => {
    navigate('/order/address');
  };

  const filteredProducts = products.filter(p => p.categoryId === selectedCategory);
  const { totalItems, totalPrice } = getCartTotal();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader className="animate-spin text-[#221896]" size={48} />
        <p className="ml-4 text-lg">درحال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8F9FA] font-['Vazirmatn'] pb-28"> {/* Add padding for footer */}
      <header className="bg-[#221896] text-white text-center p-8 shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold"
        >
          انتخاب سرویس
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-lg opacity-90"
        >
          خدمات و محصولات مورد نیاز خود را انتخاب کنید
        </motion.p>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center border-b-2 border-gray-200 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`py-3 px-6 text-lg font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'border-b-4 border-[#FF8B06] text-[#221896]'
                  : 'text-gray-500 hover:text-[#001AA8]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between border hover:border-[#FF8B06] transition-all"
            >
              <img className="h-48 w-full object-cover" src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
              </div>
              <div className="p-5 pt-0 flex justify-between items-center">
                <span className="text-lg font-bold text-[#001AA8]">{product.price.toLocaleString('fa-IR')} تومان</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#FF8B06] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-1"
                >
                  <Plus size={18}/>
                  <span>افزودن</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-2">
          <div className="container mx-auto flex justify-between items-center">
              <div>
                  <p className="font-bold text-lg">سبد خرید</p>
                  <p className="text-sm text-gray-600">
                    {totalItems} مورد | جمع کل: {totalPrice.toLocaleString('fa-IR')} تومان
                  </p>
              </div>
              <button
                onClick={handleNextStep}
                disabled={totalItems === 0}
                className="bg-[#221896] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-[#001AA8] transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
              >
                  <span>ادامه</span>
                  <ArrowLeft size={20} />
              </button>
          </div>
      </footer>
    </div>
  );
};

export default ServiceSelectionPage;
