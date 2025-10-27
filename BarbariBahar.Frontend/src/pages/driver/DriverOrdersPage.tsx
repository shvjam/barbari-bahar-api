// src/pages/driver/DriverOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { OrderStatus } from '../../types'; // Assuming you have a types file

// You might need to define this type based on your API response
interface DriverOrder {
  id: number;
  origin: string;
  destination: string;
  status: OrderStatus;
  customerName: string;
}

const DriverOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('InProgress');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = filter === 'All' ? {} : { status: filter };
        const response = await api.get<DriverOrder[]>('/driver/orders', { params });
        setOrders(response.data);
      } catch {
        setError("خطا در دریافت سفارش‌ها. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.InProgress: return 'در حال انجام';
      case OrderStatus.Completed: return 'تکمیل شده';
      default: return 'نامشخص';
    }
  };

  const StatusButton = ({ value, label }: { value: OrderStatus | 'All', label: string }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
        filter === value
          ? 'bg-[#221896] text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-[#221896]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        <Info className="inline-block mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-2">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">سفارش‌های من</h1>
        <div className="flex justify-center gap-2 my-4">
          <StatusButton value={OrderStatus.InProgress} label="در حال انجام" />
          <StatusButton value={OrderStatus.Completed} label="تکمیل شده" />
          <StatusButton value="All" label="همه" />
        </div>
      </header>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">هیچ سفارشی یافت نشد.</p>
        ) : (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/driver/orders/${order.id}`} className="block bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg text-gray-800">سفارش #{order.id}</div>
                  <div className={`px-3 py-1 text-sm rounded-full ${
                    order.status === OrderStatus.InProgress
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
                <div className="mt-4 text-gray-600 space-y-2">
                  <p><strong>مشتری:</strong> {order.customerName}</p>
                  <p><strong>مبدا:</strong> {order.origin}</p>
                  <p><strong>مقصد:</strong> {order.destination}</p>
                </div>
                <div className="mt-4 border-t pt-2 flex items-center justify-end text-[#FF8B06]">
                  <span>مشاهده جزئیات</span>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DriverOrdersPage;
