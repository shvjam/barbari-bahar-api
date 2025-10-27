import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LatLng } from 'leaflet';

// Define the shape for a single address
export interface OrderAddress {
  latlng: LatLng | null;
  fullAddress: string;
}

// Define the shape of the order state
interface OrderState {
  serviceType: 'shipping' | 'packing' | 'labor' | null;
  origin: OrderAddress;
  destination: OrderAddress;
  setServiceType: (service: 'shipping' | 'packing' | 'labor') => void;
  setOriginAddress: (address: OrderAddress) => void;
  setDestinationAddress: (address: OrderAddress) => void;
}

// Create the context with a default value
const OrderContext = createContext<OrderState | undefined>(undefined);

// Create the provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceType, setServiceTypeState] = useState<'shipping' | 'packing' | 'labor' | null>(null);
  const [origin, setOrigin] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [destination, setDestination] = useState<OrderAddress>({ latlng: null, fullAddress: '' });

  const setServiceType = (service: 'shipping' | 'packing' | 'labor') => {
    setServiceTypeState(service);
  };

  const setOriginAddress = (address: OrderAddress) => {
    setOrigin(address);
  };

  const setDestinationAddress = (address: OrderAddress) => {
    setDestination(address);
  };

  const value = {
    serviceType,
    origin,
    destination,
    setServiceType,
    setOriginAddress,
    setDestinationAddress,
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
