// src/pages/quote/ServiceTypeSelection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { Card, CardContent } from '../../components/ui/card';
import { Truck, Box } from 'lucide-react';

const updateGuestOrder = async (orderId: number, data: any) => {
    await fetch(`/api/orders/guest/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export default function ServiceTypeSelection() {
  const navigate = useNavigate();
  const { guestOrderId } = useQuote();

  const handleSelect = async (serviceType: 'full_relocation' | 'packing_supplies') => {
    if (!guestOrderId) return; // Handle error
    try {
      await updateGuestOrder(guestOrderId, { serviceType });
      if (serviceType === 'full_relocation') {
        navigate('/quote/location');
      } else {
        navigate('/quote/products');
      }
    } catch (error) {
      console.error('Failed to update service type', error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">نوع سرویس را انتخاب کنید</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card onClick={() => handleSelect('full_relocation')} className="cursor-pointer hover:bg-muted">
            <CardContent className="p-6 flex items-center">
            <Truck className="w-12 h-12 text-primary" />
            <div className="ml-4">
                <h2 className="text-lg font-bold">اسباب‌کشی سریع، مطمئن و آسان</h2>
                <p className="text-sm text-muted-foreground">ویژه جابجایی منازل و شرکت‌ها</p>
            </div>
            </CardContent>
        </Card>
        <Card onClick={() => handleSelect('packing_supplies')} className="cursor-pointer hover:bg-muted">
            <CardContent className="p-6 flex items-center">
            <Box className="w-12 h-12 text-primary" />
            <div className="ml-4">
                <h2 className="text-lg font-bold">خرید لوازم بسته‌بندی</h2>
                <p className="text-sm text-muted-foreground">کارتن، چسب، نایلون حباب‌دار و...</p>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
