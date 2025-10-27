// src/types.ts

// This enum defines the possible states an order can be in.
// It's shared across the customer, admin, and driver sections.
export enum OrderStatus {
  PendingPayment = 'PendingPayment',
  PendingAdminApproval = 'PendingAdminApproval',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

// You can add more shared types here as the application grows.
