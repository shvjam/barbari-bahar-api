// src/services/quote.ts
import api from './api';

export const createGuestOrder = async (): Promise<{ orderId: number }> => {
  const response = await api.post('/orders/guest');
  return response.data;
};

export const updateGuestOrder = async (orderId: number, data: any): Promise<any> => {
  const response = await api.patch(`/orders/guest/${orderId}`, data);
  return response.data;
};
