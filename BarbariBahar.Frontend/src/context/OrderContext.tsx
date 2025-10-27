import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LatLng } from 'leaflet';

// Define the shape for a single address
export interface OrderAddress {
  latlng: LatLng | null;
  fullAddress: string;
}

// Define schedule details
export interface ScheduleDetails {
  date: string | null;
  time: string;
  description: string;
}

// Define a product as it is fetched from the API
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}

// Define a category as it is fetched from the API
export interface Category {
  id: number;
  name: string;
}

// Define the shape for an item in the cart
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of the order state
interface OrderState {
  origin: OrderAddress;
  destination: OrderAddress;
  schedule: ScheduleDetails;
  cart: CartItem[];
  setOriginAddress: (address: OrderAddress) => void;
  setDestinationAddress: (address: OrderAddress) => void;
  setScheduleDetails: (details: ScheduleDetails) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  getCartTotal: () => { totalItems: number; totalPrice: number };
}

// Create the context with a default value
const OrderContext = createContext<OrderState | undefined>(undefined);

// Create the provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [origin, setOrigin] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [destination, setDestination] = useState<OrderAddress>({ latlng: null, fullAddress: '' });
  const [schedule, setSchedule] = useState<ScheduleDetails>({ date: null, time: '', description: '' });
  const [cart, setCart] = useState<CartItem[]>([]);

  const setOriginAddress = (address: OrderAddress) => setOrigin(address);
  const setDestinationAddress = (address: OrderAddress) => setDestination(address);
  const setScheduleDetails = (details: ScheduleDetails) => setSchedule(details);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, just increase quantity
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Otherwise, add new item with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const value = {
    origin,
    destination,
    schedule,
    cart,
    setOriginAddress,
    setDestinationAddress,
    setScheduleDetails,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
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
