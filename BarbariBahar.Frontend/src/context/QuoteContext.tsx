// src/context/QuoteContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface QuoteContextType {
  guestOrderId: number | null;
  setGuestOrderId: (id: number | null) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [guestOrderId, setGuestOrderId] = useState<number | null>(null);

  return (
    <QuoteContext.Provider value={{ guestOrderId, setGuestOrderId }}>
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
