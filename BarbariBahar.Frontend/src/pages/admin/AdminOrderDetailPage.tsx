// src/pages/admin/AdminOrderDetailPage.tsx
import React, 'useEffect', useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ArrowRight, User, Phone, MapPin, ShoppingBag, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import api from '../../services/api';
import AssignDriverModal from '../../components/admin/AssignDriverModal';
import UpdateStatusModal, { OrderStatus } from '../../components/admin/UpdateStatusModal';

interface OrderDetail {
  id: number;
  trackingCode: string;
  status: OrderStatus;
  createdAt: string;
  finalPrice: number;
  customer: { id: number; firstName: string; lastName: string; mobile: string; };
  driver: { id: number; firstName: string; lastName: string; mobile: string; } | null;
  addresses: { type: string; fullAddress: string; latitude: number; longitude: number; }[];
  items: { itemName: string; quantity: number; unitPrice: number; totalPrice: number; }[];
}

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);

  const fetchOrderDetail = async () => {
    // Keep loading true if it's not the initial load, to show feedback
    if (!loading) setLoading(true);
    try {
      const response = await api.get<OrderDetail>(`/admin/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError('خطا در دریافت جزئیات سفارش.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleAssignDriver = async (driverId: number) => {
    try {
      await api.put(`/admin/orders/${order!.id}/assign-driver`, { driverId });
      setIsAssignDriverModalOpen(false);
      fetchOrderDetail();
    } catch (err) {
      alert('خطا در تخصیص راننده.');
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      await api.put(`/admin/orders/${order!.id}/status`, { status: newStatus });
      setIsUpdateStatusModalOpen(false);
      fetchOrderDetail();
    } catch (err) {
      alert('خطا در به‌روزرسانی وضعیت.');
    }
  };

  if (loading && !order) { // Only show full-page loader on initial load
    return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-[#221896]" size={48} /></div>;
  }

  if (error || !order) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error || 'سفارش یافت نشد.'}</div>;
  }

  const origin = order.addresses.find(a => a.type === 'Origin');
  const destination = order.addresses.find(a => a.type === 'Destination');
  const mapCenter: LatLngExpression = origin ? [origin.latitude, origin.longitude] : [35.6892, 51.3890];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link to="/admin/orders" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowRight className="ml-2" />
          بازگشت به لیست سفارشات
        </Link>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">جزئیات سفارش <span className="font-mono">#{order.trackingCode}</span></h2>
          <span className="text-xl font-semibold bg-blue-100 text-blue-800 px-4 py-1 rounded-full">{order.status}</span>
        </div>

        {/* Rest of the detail page layout... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Items and Map */}
            </div>
            <div className="space-y-6">
                {/* Customer, Address, Driver Info */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4">عملیات</h3>
                    <div className="space-y-3">
                        <button onClick={() => setIsAssignDriverModalOpen(true)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            اختصاص راننده
                        </button>
                        <button onClick={() => setIsUpdateStatusModalOpen(true)} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                            تغییر وضعیت
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      <AssignDriverModal
        isOpen={isAssignDriverModalOpen}
        onClose={() => setIsAssignDriverModalOpen(false)}
        onAssign={handleAssignDriver}
        orderId={order.id}
      />

      <UpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        onSave={handleUpdateStatus}
        currentStatus={order.status}
      />
    </>
  );
};

export default AdminOrderDetailPage;
