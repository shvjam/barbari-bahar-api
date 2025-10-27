import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { LatLng } from 'leaflet';
import api from '../services/api';

// --- Interfaces ---
// Ensure all types and interfaces are exported so components can use them
export interface OrderAddress {
  latlng: LatLng | null;
  fullAddress: string;
}

export interface ScheduleDetails {
  date: string;
  time: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PricingFactor {
  id: number;
  name: string;
  price: number;
  unit: string;
  serviceCategoryId: number;
}

export type ServiceType = 'Moving' | 'Packing' | 'Labor' | null;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  role: string;
}


// --- Order State Definition ---
interface OrderState {
  // Order details
  serviceType: ServiceType;
  origin: OrderAddress;
  destination: OrderAddress;
  schedule: ScheduleDetails;
  cart: CartItem[];
  pricingFactorIds: number[];
  totalPrice: number;

  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // Functions
  setServiceType: (serviceType: ServiceType) => void;
  setOriginAddress: (address: OrderAddress) => void;
  setDestinationAddress: (address: OrderAddress) => void;
  setScheduleDetails: (details: ScheduleDetails) => void;
  addToCart: (product: Product) => void;
  togglePricingFactor: (factorId: number) => void;
  getCartTotal: () => number;
  setTotalPrice: (price: number) => void;

  // Auth Functions
  login: (token: string, user: User) => void;
  logout: () => void;
}

const OrderContext = createContext<OrderState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Hooks ---
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [origin, setOriginAddress] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [destination, setDestinationAddress] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [schedule, setScheduleDetails] = useState<ScheduleDetails>({ date: new Date().toISOString().split('T')[0], time: '', description: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricingFactorIds, setPricingFactorIds] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('customer_token'));

  // --- Effects ---
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You might want to fetch user profile here if needed
    }
  }, [token]);

  // --- Functions ---
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('customer_token', newToken);
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const togglePricingFactor = (factorId: number) => {
    setPricingFactorIds(prevIds =>
      prevIds.includes(factorId)
        ? prevIds.filter(id => id !== factorId)
        : [...prevIds, factorId]
    );
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  const value: OrderState = {
    serviceType,
    setServiceType,
    origin,
    setOriginAddress,
    destination,
    setDestinationAddress,
    schedule,
    setScheduleDetails,
    cart,
    addToCart,
    pricingFactorIds,
    togglePricingFactor,
    getCartTotal,
    totalPrice,
    setTotalPrice,
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
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
