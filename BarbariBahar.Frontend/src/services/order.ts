import api from './api';
import type {
  CreateOrderRequestDto,
  CalculatePriceResponseDto,
  CreateOrderResponseDto
} from '../types/order';

export const calculateOrderPrice = async (orderDetails: CreateOrderRequestDto): Promise<CalculatePriceResponseDto> => {
  const response = await api.post<CalculatePriceResponseDto>('/Order/calculate-price', orderDetails);
  return response.data;
};

export const createOrder = async (orderDetails: CreateOrderRequestDto): Promise<CreateOrderResponseDto> => {
  const response = await api.post<CreateOrderResponseDto>('/Order', orderDetails);
  return response.data;
};
