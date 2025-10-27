// src/pages/QuotePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import api from '../services/api';
import { Loader, AlertTriangle, CheckCircle, ShoppingBag, MapPin, Calendar, Clock, Wrench } from 'lucide-react';

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, origin, destination, schedule, pricingFactorIds, serviceType } = useOrder();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const calculatePrice = async () => {
      // Basic validation
      if (!origin.latlng || !destination.latlng || (cart.length === 0 && pricingFactorIds.length === 0)) {
        setError("اطلاعات سفارش کامل نیست.");
        setLoading(false);
        return;
      }

      const requestBody = {
        origin: { latitude: origin.latlng.lat, longitude: origin.latlng.lng, fullAddress: origin.fullAddress },
        destination: { latitude: destination.latlng.lat, longitude: destination.latlng.lng, fullAddress: destination.fullAddress },
        packagingProducts: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        pricingFactorIds: pricingFactorIds,
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
  }, [cart, origin, destination, pricingFactorIds]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // ... same submission logic as before, now it correctly includes both cart and factors
    const requestBody = {
        origin: { latitude: origin.latlng!.lat, longitude: origin.latlng!.lng, fullAddress: origin.fullAddress },
        destination: { latitude: destination.latlng!.lat, longitude: destination.latlng!.lng, fullAddress: destination.fullAddress },
        packagingProducts: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        pricingFactorIds: pricingFactorIds,
        finalPrice: totalPrice,
        scheduledAt: `${schedule.date}T${schedule.time}`,
      };

      try {
        await api.post('/order', requestBody);
        navigate('/order/confirmation');
      } catch (err) {
        setError("خطا در ثبت سفارش.");
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
      <header className="bg-[#221896] text-white text-center p-6 shadow-md">
        <h1 className="text-3xl font-bold">پیش‌فاکتور و تأیید نهایی</h1>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">خلاصه سفارش</h2>

          {/* Items Section (conditional) */}
          {serviceType === 'Packing' && cart.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><ShoppingBag className="ml-2 text-[#FF8B06]" />محصولات بسته‌بندی</h3>
              {/* ... cart items list */}
            </div>
          )}
          {serviceType === 'Moving' && pricingFactorIds.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><Wrench className="ml-2 text-[#FF8B06]" />خدمات اسباب‌کشی</h3>
              {/* Here you would ideally fetch factor names to display, for now just showing count */}
              <p>{pricingFactorIds.length} سرویس انتخاب شده است.</p>
            </div>
          )}

          {/* Common sections */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><MapPin className="ml-2 text-[#FF8B06]" />آدرس‌ها</h3>
            <p><strong>مبدأ:</strong> {origin.fullAddress}</p>
            <p><strong>مقصد:</strong> {destination.fullAddress}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Calendar className="ml-2 text-[#FF8B06]" />زمان‌بندی</h3>
            <p><strong>تاریخ:</strong> {schedule.date}</p>
            <p><strong>ساعت:</strong> {schedule.time}</p>
          </div>

          {/* Price & Submit */}
          <div className="border-t-2 border-dashed pt-6 mt-6">
            {/* ... loading, error, and price display logic from before ... */}
            {totalPrice !== null && (
                <div className="text-center">
                    <p className="text-lg text-gray-600">قیمت نهایی محاسبه شده</p>
                    <p className="text-4xl font-extrabold text-[#001AA8] my-2">{totalPrice.toLocaleString('fa-IR')} تومان</p>
                    <button onClick={handleFinalSubmit} disabled={isSubmitting} className="...">
                        {isSubmitting ? 'درحال ثبت...' : 'تأیید و ثبت نهایی سفارش'}
                    </button>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotePage;
