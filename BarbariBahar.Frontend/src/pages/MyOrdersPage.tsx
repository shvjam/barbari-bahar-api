// src/pages/MyOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ShoppingCart } from 'lucide-react';
import api from '../services/api';

interface OrderSummary {
  id: number;
  trackingCode: string;
  status: string;
  createdAt: string;
  finalPrice: number;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<OrderSummary[]>('/order/my-orders');
        setOrders(response.data);
      } catch (err) {
        setError('برای مشاهده سفارشات، ابتدا باید وارد حساب کاربری خود شوید.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR');

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
      {/* A simple header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#221896]">سفارشات من</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center mt-10"><Loader className="animate-spin text-[#221896]" size={40} /></div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg"><AlertTriangle className="inline ml-2" />{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4" />
            <p>شما هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-md">
            <table className="w-full text-right">
              {/* Table Head */}
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.trackingCode}</td>
                    <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">{order.finalPrice.toLocaleString('fa-IR')} تومان</td>
                    <td className="py-3 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
