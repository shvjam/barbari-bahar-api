// src/pages/MyOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'InProgress':
      case 'HeadingToOrigin':
        return 'text-blue-600';
      case 'Completed':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {orders.map(order => (
              <Link to={`/order/${order.id}`} key={order.id} className="block bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg text-gray-800">سفارش #{order.trackingCode}</span>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-semibold ${getStatusClass(order.status)}`}>{order.status}</span>
                    <ArrowLeft className="mr-2 text-gray-400" />
                  </div>
                </div>
                <div className="mt-2 border-t pt-2 text-left">
                  <span className="font-bold">{order.finalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
