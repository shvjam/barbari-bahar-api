// src/services/OrderService.ts
import api from './api';

export class OrderService {
    static async updateGuestOrder(orderId: number, data: any) {
        const response = await api.patch(`/guest/orders/${orderId}`, data);
        return response.data;
    }
}
