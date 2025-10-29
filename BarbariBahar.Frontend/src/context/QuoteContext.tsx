// src/context/QuoteContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PriceDetails {
  distancePrice: number;
  laborPrice: number;
  packingSupplies: { name: string; unitPrice: number; quantity: number; subtotal: number }[];
  totalPrice: number;
}

interface QuoteContextType {
  guestOrderId: number | null;
  setGuestOrderId: (id: number | null) => void;
  priceDetails: PriceDetails | null;
  setPriceDetails: (details: PriceDetails | null) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [guestOrderId, setGuestOrderId] = useState<number | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceDetails | null>(null);

  return (
    <QuoteContext.Provider value={{ guestOrderId, setGuestOrderId, priceDetails, setPriceDetails }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
