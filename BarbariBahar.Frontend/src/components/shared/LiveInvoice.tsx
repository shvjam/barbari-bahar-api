// src/components/shared/LiveInvoice.tsx
import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

export default function LiveInvoice() {
  const { priceDetails } = useQuote();

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>جمع کل حدودی</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">
          {(priceDetails?.totalPrice || 0).toLocaleString()} تومان
        </div>
        <Separator />
        <div className="mt-4 space-y-2 text-sm">
          {priceDetails?.priceFactors?.map((factor, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{factor.name}</span>
              <span>{factor.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
