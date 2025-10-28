// src/services/order.ts
import api from './api';
import type {
  CalculatePriceRequestDto,
  CalculatePriceResponseDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto
} from '../types';

/**
 * Sends a request to the backend to calculate the estimated price of an order.
 * @param orderDetails - The details of the order for price calculation.
 * @returns A promise that resolves to the price calculation response.
 */
export const calculateOrderPrice = async (orderDetails: CalculatePriceRequestDto): Promise<CalculatePriceResponseDto> => {
  try {
    const response = await api.post<CalculatePriceResponseDto>('/Order/calculate-price', orderDetails);
    return response.data;
  } catch (error) {
    console.error('Error calculating order price:', error);
    // You can customize error handling, e.g., by throwing a specific error message
    throw new Error('Failed to calculate price. Please try again.');
  }
};

/**
 * Submits the final order details to the backend to create a new order.
 * @param orderDetails - The complete details of the order to be created.
 * @returns A promise that resolves to the order creation confirmation.
 */
export const createOrder = async (orderDetails: CreateOrderRequestDto): Promise<CreateOrderResponseDto> => {
  try {
    const response = await api.post<CreateOrderResponseDto>('/Order', orderDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order. Please try again.');
  }
};
