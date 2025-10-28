// src/types.ts

// DTO for heavy items, matching the backend
export interface HeavyItemDto {
  itemId: string;
  quantity: number;
}

// DTO for individual items in the order, matching the backend
export interface OrderItemDto {
  productId: number;
  quantity: number;
}

// The main DTO for calculating the price, matching the backend
export interface CalculatePriceRequestDto {
  origin: {
    latitude: number;
    longitude: number;
    fullAddress: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    fullAddress: string;
  };
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

// The main DTO for creating an order, matching the backend
// Note the absence of finalPrice
export interface CreateOrderRequestDto extends Omit<CalculatePriceRequestDto, 'finalPrice'> {
  scheduledAt?: string | Date;
}

// Expected response from the price calculation endpoint
export interface CalculatePriceResponseDto {
  totalPrice: number;
  priceFactors: {
    name: string;
    price: number;
  }[];
}

// Expected response from the order creation endpoint
export interface CreateOrderResponseDto {
  orderId: number;
  trackingCode: string;
}
