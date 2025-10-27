// src/pages/QuotePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import api from '../services/api';
import { Loader, CheckCircle } from 'lucide-react';
import AuthModal from '../components/shared/AuthModal'; // Import the modal

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, origin, destination, schedule, pricingFactorIds, isAuthenticated, setTotalPrice: setGlobalTotalPrice, totalPrice } = useOrder();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const calculatePrice = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          cart,
          origin,
          destination,
          schedule,
          pricingFactorIds,
        };
        const response = await api.post('/order/calculate-price', requestBody);
        setGlobalTotalPrice(response.data.finalPrice);
      } catch {
        setError("خطا در محاسبه قیمت.");
      } finally {
        setLoading(false);
      }
    };
    calculatePrice();
  }, [cart, origin, destination, schedule, pricingFactorIds, setGlobalTotalPrice]);


  const handleFinalSubmit = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
        const requestBody = {
            cart,
            origin,
            destination,
            schedule,
            pricingFactorIds,
        };
        await api.post('/order', requestBody);
        navigate('/order/confirmation');
      } catch {
        setError("خطا در ثبت سفارش.");
      } finally {
        setIsSubmitting(false);
      }
  };

  const onLoginSuccess = () => {
    // After successful login, retry the submission
    handleFinalSubmit();
  };

  return (
    <>
      <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
        {/* ... (Header and main content from before) */}

        <main className="container mx-auto p-4 md:p-8 max-w-4xl">
          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            {/* ... (Order summary sections from before) */}

            <div className="border-t-2 border-dashed pt-6 mt-6">
              {/* ... (Price display logic from before) */}

              {totalPrice !== null && (
                <div className="text-center">
                  <p className="text-lg text-gray-600">قیمت نهایی محاسبه شده</p>
                  <p className="text-4xl font-extrabold text-[#001AA8] my-2">{totalPrice.toLocaleString('fa-IR')} تومان</p>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || loading}
                    className="mt-6 w-full max-w-md mx-auto bg-green-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-400"
                  >
                    {isSubmitting ? <Loader className="animate-spin"/> : <CheckCircle />}
                    <span>{isAuthenticated ? 'تأیید و ثبت نهایی سفارش' : 'ورود و ثبت سفارش'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onLoginSuccess}
      />
    </>
  );
};

export default QuotePage;
