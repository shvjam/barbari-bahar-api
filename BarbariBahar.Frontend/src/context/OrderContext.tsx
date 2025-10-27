import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LatLng } from 'leaflet';

// --- Existing Interfaces ---
export interface OrderAddress { latlng: LatLng | null; fullAddress: string; }
export interface ScheduleDetails { date: string | null; time: string; description: string; }
export interface Product { id: number; name: string; description: string; price: number; categoryId: number; imageUrl: string; }
export interface Category { id: number; name: string; }
export interface CartItem extends Product { quantity: number; }

// --- New State Definitions ---
export interface PricingFactor { id: number; name: string; price: number; unit: string; serviceCategoryId: number; }
export type ServiceType = 'Moving' | 'Packing' | 'Labor' | null;

// Define the shape of the order state
interface OrderState {
  serviceType: ServiceType;
  origin: OrderAddress;
  destination: OrderAddress;
  schedule: ScheduleDetails;
  cart: CartItem[];
  pricingFactorIds: number[]; // <-- New state for selected pricing factors

  setServiceType: (serviceType: ServiceType) => void;
  setOriginAddress: (address: OrderAddress) => void;
  setDestinationAddress: (address: OrderAddress) => void;
  setScheduleDetails: (details: ScheduleDetails) => void;

  // Cart functions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  getCartTotal: () => { totalItems: number; totalPrice: number };

  // Pricing factor functions
  togglePricingFactor: (factorId: number) => void;
}

const OrderContext = createContext<OrderState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [origin, setOrigin] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [destination, setDestination] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [schedule, setSchedule] = useState<ScheduleDetails>({ date: null, time: '', description: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricingFactorIds, setPricingFactorIds] = useState<number[]>([]);

  // --- Cart Management ---
  const addToCart = (product: Product) => { /* ... implementation from before ... */ };
  const removeFromCart = (productId: number) => { /* ... implementation from before ... */ };
  const updateCartItemQuantity = (productId: number, quantity: number) => { /* ... implementation from before ... */ };
  const getCartTotal = () => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  // --- Pricing Factor Management ---
  const togglePricingFactor = (factorId: number) => {
    setPricingFactorIds(prevIds =>
      prevIds.includes(factorId)
        ? prevIds.filter(id => id !== factorId)
        : [...prevIds, factorId]
    );
  };

  const value = {
    serviceType,
    origin,
    destination,
    schedule,
    cart,
    pricingFactorIds,
    setServiceType,
    setOriginAddress: setOrigin,
    setDestinationAddress: setDestination,
    setScheduleDetails: setSchedule,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    togglePricingFactor,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
