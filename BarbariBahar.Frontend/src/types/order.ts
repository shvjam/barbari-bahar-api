// src/types/order.ts

export interface HeavyItemDto {
  itemId: string;
  quantity: number;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequestDto {
  origin: { latitude: number; longitude: number; fullAddress: string; };
  destination: { latitude: number; longitude: number; fullAddress: string; };
  scheduledAt?: string | Date;
  originFloor: number;
  originElevator: boolean;
  destFloor: number;
  destElevator: boolean;
  workers: number;
  walkDistance: number;
  heavyItems: HeavyItemDto[];
  pricingFactorIds?: number[];
  packagingProducts?: OrderItemDto[];
}

export interface CalculatePriceResponseDto {
  totalPrice: number;
  priceFactors: { name: string; price: number; }[];
}

export interface CreateOrderResponseDto {
  orderId: number;
  trackingCode: string;
}
