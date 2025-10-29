import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("customer_token") || localStorage.getItem("admin_token") || localStorage.getItem("driver_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchProductCategories = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await api.get('/api/PackagingProductCategories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

export const fetchProducts = async (categoryId?: number): Promise<any[]> => {
  try {
    const url = categoryId ? `/api/products?categoryId=${categoryId}` : '/api/products';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};


export default api;
