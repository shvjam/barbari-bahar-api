// src/pages/CustomerOrderDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft, Package, User, MapPin } from 'lucide-react';
import api from '../services/api';
import { OrderStatus } from '../types';
import LiveLocationTracker from '../components/shared/LiveLocationTracker';

// Define the detailed order structure based on expected API response
interface OrderDetail {
  id: number;
  status: OrderStatus;
  finalPrice: number;
  items: { itemName: string; quantity: number; totalPrice: number }[];
  addresses: { type: string; fullAddress: string }[];
  driverInfo: { fullName: string; carModel: string; carPlateNumber: string } | null;
}

const CustomerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Assuming an endpoint like this exists for customer order details
        const response = await api.get<OrderDetail>(`/order/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت جزئیات سفارش.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800"><Icon className="ml-2 text-[#FF8B06]" />{title}</h3>
      <div className="text-gray-700 space-y-2">{children}</div>
    </div>
  );

  if (loading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-[#221896]" size={40} /></div>;
  if (error || !order) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg"><AlertTriangle className="inline ml-2" />{error}</div>;

  const showTracker = order.status === OrderStatus.HeadingToOrigin || order.status === OrderStatus.InProgress;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn'] p-4 md:p-8">
      <header className="container mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#221896]">جزئیات سفارش #{order.id}</h1>
        <Link to="/my-orders" className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="ml-1" />
          بازگشت به لیست
        </Link>
      </header>

      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard icon={Package} title="اقلام سفارش">
            {order.items.map((item, i) => <p key={i}>{item.itemName} (×{item.quantity})</p>)}
            <p className="font-bold text-lg border-t pt-2 mt-2">جمع کل: {order.finalPrice.toLocaleString('fa-IR')} تومان</p>
          </InfoCard>

          {showTracker && <LiveLocationTracker orderId={order.id} />}
        </div>
        <div className="space-y-6">
          <InfoCard icon={MapPin} title="آدرس‌ها">
            {order.addresses.map((addr, i) => <p key={i}><strong>{addr.type === 'Origin' ? 'مبدا' : 'مقصد'}:</strong> {addr.fullAddress}</p>)}
          </InfoCard>
          {order.driverInfo && (
            <InfoCard icon={User} title="اطلاعات راننده">
              <p><strong>نام:</strong> {order.driverInfo.fullName}</p>
              <p><strong>خودرو:</strong> {order.driverInfo.carModel}</p>
              <p><strong>پلاک:</strong> {order.driverInfo.carPlateNumber}</p>
            </InfoCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerOrderDetailPage;
