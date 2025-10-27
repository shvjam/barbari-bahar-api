// src/pages/QuotePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import api from '../services/api';
import { Loader, AlertTriangle, CheckCircle, ShoppingBag, MapPin, Calendar, Clock } from 'lucide-react';

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, origin, destination, schedule, getCartTotal } = useOrder();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const calculatePrice = async () => {
      if (!origin.latlng || !destination.latlng || cart.length === 0) {
        setError("اطلاعات سفارش کامل نیست.");
        setLoading(false);
        return;
      }

      const requestBody = {
        origin: {
          latitude: origin.latlng.lat,
          longitude: origin.latlng.lng,
          fullAddress: origin.fullAddress,
        },
        destination: {
          latitude: destination.latlng.lat,
          longitude: destination.latlng.lng,
          fullAddress: destination.fullAddress,
        },
        packagingProducts: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        // Assuming no other pricing factors for now. This can be extended.
        pricingFactorIds: [],
      };

      try {
        const response = await api.post('/order/calculate-price', requestBody);
        setTotalPrice(response.data.totalPrice);
      } catch (err) {
        setError("خطا در محاسبه قیمت. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    calculatePrice();
  }, [cart, origin, destination]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const requestBody = {
      origin: { latitude: origin.latlng!.lat, longitude: origin.latlng!.lng, fullAddress: origin.fullAddress },
      destination: { latitude: destination.latlng!.lat, longitude: destination.latlng!.lng, fullAddress: destination.fullAddress },
      packagingProducts: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
      pricingFactorIds: [],
      finalPrice: totalPrice,
      scheduledAt: `${schedule.date}T${schedule.time}`,
    };

    try {
      await api.post('/order', requestBody);
      // On success, navigate to a confirmation page (not built yet)
      alert("سفارش شما با موفقیت ثبت شد!");
      // navigate('/order/confirmation');
    } catch (err) {
      setError("خطا در ثبت سفارش. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
      <header className="bg-[#221896] text-white text-center p-6 shadow-md">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
          پیش‌فاکتور و تأیید نهایی
        </motion.h1>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">خلاصه سفارش</h2>

          {/* Cart Items */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><ShoppingBag className="ml-2 text-[#FF8B06]" />محصولات</h3>
            <ul className="space-y-3">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center text-gray-700">
                  <span>{item.name} (×{item.quantity})</span>
                  <span>{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Addresses */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><MapPin className="ml-2 text-[#FF8B06]" />آدرس‌ها</h3>
            <p><strong>مبدأ:</strong> {origin.fullAddress}</p>
            <p><strong>مقصد:</strong> {destination.fullAddress}</p>
          </div>

          {/* Schedule */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Calendar className="ml-2 text-[#FF8B06]" />زمان‌بندی</h3>
            <p><strong>تاریخ:</strong> {schedule.date}</p>
            <p><strong>ساعت:</strong> {schedule.time}</p>
          </div>

          <div className="border-t-2 border-dashed pt-6 mt-6">
            {loading && (
              <div className="flex justify-center items-center text-lg">
                <Loader className="animate-spin ml-3" />
                <span>درحال محاسبه قیمت نهایی...</span>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="ml-3" />
                <span>{error}</span>
              </div>
            )}
            {totalPrice !== null && (
              <div className="text-center">
                <p className="text-lg text-gray-600">قیمت نهایی محاسبه شده</p>
                <p className="text-4xl font-extrabold text-[#001AA8] my-2">{totalPrice.toLocaleString('fa-IR')} تومان</p>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="mt-6 w-full max-w-md mx-auto bg-green-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-400"
                >
                  {isSubmitting ? <Loader className="animate-spin"/> : <CheckCircle />}
                  <span>{isSubmitting ? 'درحال ثبت...' : 'تأیید و ثبت نهایی سفارش'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default QuotePage;
