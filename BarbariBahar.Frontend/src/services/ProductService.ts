// src/services/ProductService.ts
import api from './api';

export class ProductService {
    static async getPackingItems() {
        const response = await api.get("/products/packing-items");
        return response.data;
    }
}
