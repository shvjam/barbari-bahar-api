// src/pages/admin/AdminOrderDetailPage.tsx
import React, 'useEffect', useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ArrowRight, User, Phone, MapPin, ShoppingBag, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import api from '../../services/api';
import AssignDriverModal from '../../components/admin/AssignDriverModal';

interface OrderDetail {
  id: number;
  trackingCode: string;
  status: string;
  createdAt: string;
  finalPrice: number;
  customer: { id: number; firstName: string; lastName: string; mobile: string; };
  driver: { id: number; firstName: string; lastName: string; mobile: string; } | null;
  addresses: { type: string; fullAddress: string; latitude: number; longitude: number; }[];
  items: { itemName: string; quantity: number; unitPrice: number; totalPrice: number; }[];
}

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrderDetail = async () => {
    setLoading(true);
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
      setIsModalOpen(false);
      fetchOrderDetail(); // Refresh order details to show the newly assigned driver
    } catch (err) {
      alert('خطا در تخصیص راننده.');
    }
  };

  if (loading) {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center"><ShoppingBag className="ml-2 text-[#FF8B06]" />اقلام سفارش</h3>
              {/* ... item list from previous step */}
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-xl shadow-md h-80">
              <MapContainer center={mapCenter} zoom={12} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {origin && <Marker position={[origin.latitude, origin.longitude]} />}
                {destination && <Marker position={[destination.latitude, destination.longitude]} />}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Info, Address Info */}

            {/* Driver Info */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center"><Truck className="ml-2 text-[#FF8B06]" />اطلاعات راننده</h3>
              {order.driver ? (
                <>
                  <p>{order.driver.firstName} {order.driver.lastName}</p>
                  <p className="mt-2">{order.driver.mobile}</p>
                </>
              ) : (
                <p>راننده‌ای تخصیص داده نشده است.</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">عملیات</h3>
              <div className="space-y-3">
                 <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  اختصاص راننده
                </button>
                {/* Other actions */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AssignDriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssignDriver}
        orderId={order.id}
      />
    </>
  );
};

export default AdminOrderDetailPage;
