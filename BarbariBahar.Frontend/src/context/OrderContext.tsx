import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the order state
interface OrderState {
  serviceType: 'shipping' | 'packing' | 'labor' | null;
  setServiceType: (service: 'shipping' | 'packing' | 'labor') => void;
  // ... other state properties will be added later (e.g., addresses, vehicle, etc.)
}

// Create the context with a default value
const OrderContext = createContext<OrderState | undefined>(undefined);

// Create the provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceType, setServiceTypeState] = useState<'shipping' | 'packing' | 'labor' | null>(null);

  const setServiceType = (service: 'shipping' | 'packing' | 'labor') => {
    setServiceTypeState(service);
  };

  const value = {
    serviceType,
    setServiceType,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
