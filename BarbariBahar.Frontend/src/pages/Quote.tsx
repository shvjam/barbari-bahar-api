// src/pages/Quote.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import { Oval } from 'react-loader-spinner';

// This is a temporary API function. It will be moved to a proper service file.
const createGuestOrder = async (): Promise<{ orderId: number }> => {
    const response = await fetch('/api/orders/guest', { method: 'POST' });
    if (!response.ok) {
        throw new Error('Failed to create guest order');
    }
    return response.json();
};

export default function Quote() {
  const navigate = useNavigate();
  const { setGuestOrderId } = useQuote();

  useEffect(() => {
    const initializeQuote = async () => {
      try {
        const { orderId } = await createGuestOrder();
        setGuestOrderId(orderId);
        navigate('/quote/service-type'); // Navigate to the next step
      } catch (error) {
        console.error(error);
        // Handle error, maybe navigate to an error page or show a toast
        navigate('/');
      }
    };

    initializeQuote();
  }, [navigate, setGuestOrderId]);

  return (
    <div className="flex justify-center items-center h-64">
      <Oval color="#221896" height={80} width={80} />
      <p className="ml-4">در حال آماده‌سازی فرم استعلام...</p>
    </div>
  );
}
