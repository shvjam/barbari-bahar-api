// src/pages/admin/AdminOrdersPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Define types locally for this page
enum OrderStatus {
  PendingPayment = 'PendingPayment',
  PendingAdminApproval = 'PendingAdminApproval',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

interface OrderSummary {
  id: number;
  trackingCode: string;
  customerName: string;
  status: string;
  createdAt: string;
  finalPrice: number;
}

const statusTabs = [
  { key: 'All', label: 'همه' },
  { key: OrderStatus.PendingAdminApproval, label: 'در انتظار تایید' },
  { key: OrderStatus.InProgress, label: 'در حال انجام' },
  { key: OrderStatus.Completed, label: 'تکمیل شده' },
  { key: OrderStatus.Cancelled, label: 'لغو شده' },
];

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<OrderSummary[]>('/admin/orders');
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('خطا در دریافت لیست سفارشات.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeStatus === 'All') {
      return orders;
    }
    return orders.filter(order => order.status === activeStatus);
  }, [orders, activeStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (error) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">مدیریت سفارشات</h2>

      <div className="flex border-b-2 border-gray-200 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`py-3 px-5 text-md font-semibold transition-all duration-300 ${
              activeStatus === tab.key
                ? 'border-b-4 border-[#FF8B06] text-[#221896]'
                : 'text-gray-500 hover:text-[#001AA8]'
            }`}
          >
            {tab.label}
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
                <th className="py-3 px-4">کد رهگیری</th>
                <th className="py-3 px-4">مشتری</th>
                <th className="py-3 px-4">تاریخ ثبت</th>
                <th className="py-3 px-4">مبلغ</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">{order.trackingCode}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">{order.finalPrice.toLocaleString('fa-IR')} تومان</td>
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrdersPage;
