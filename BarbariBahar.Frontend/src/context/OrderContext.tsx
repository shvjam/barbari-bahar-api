import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LatLng } from 'leaflet';
import api from '../services/api'; // Import api to set token on login

// --- Interfaces ---
export interface OrderAddress { latlng: LatLng | null; fullAddress: string; }
export interface ScheduleDetails { date: string | null; time: string; description: string; }
export interface Product { id: number; name: string; description: string; price: number; categoryId: number; imageUrl: string; }
export interface Category { id: number; name: string; }
export interface CartItem extends Product { quantity: number; }
export interface PricingFactor { id: number; name: string; price: number; unit: string; serviceCategoryId: number; }
export type ServiceType = 'Moving' | 'Packing' | 'Labor' | null;
export interface User { id: number; firstName: string; lastName: string; mobile: string; role: string; }

// --- Order State Definition ---
interface OrderState {
  // Order details
  serviceType: ServiceType;
  origin: OrderAddress;
  destination: OrderAddress;
  schedule: ScheduleDetails;
  cart: CartItem[];
  pricingFactorIds: number[];

  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // Functions
  setServiceType: (serviceType: ServiceType) => void;
  // ... other order functions
  login: (token: string, user: User) => void;
  logout: () => void;
}

const OrderContext = createContext<OrderState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Hooks ---
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [origin, setOrigin] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  // ... other order state hooks
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricingFactorIds, setPricingFactorIds] = useState<number[]>([]);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('customer_token'));

  // --- Effects ---
  useEffect(() => {
    // On app load, check if a token exists and fetch user profile
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/users/me').then(response => {
        setUser(response.data);
      }).catch(() => {
        // Token is invalid, log out
        logout();
      });
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

  // ... other functions like addToCart, togglePricingFactor etc.

  const value: OrderState = {
    // ... order state
    isAuthenticated: !!token && !!user,
    user,
    token,
    login,
    logout,
    // Bind other state and functions here
    serviceType, setServiceType,
    origin, setOriginAddress: setOrigin,
    //...
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
