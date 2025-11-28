import axios from 'axios';
import { Product, PriceEntry, PriceStatistics } from './types';

const API_BASE_URL = '/api';

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  createProduct: async (product: Product): Promise<Product> => {
    const response = await axios.post(`${API_BASE_URL}/products`, product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  },

  // Prices
  addPrice: async (productId: number, priceData: Omit<PriceEntry, 'product_id'>): Promise<void> => {
    await axios.post(`${API_BASE_URL}/products/${productId}/prices`, priceData);
  },

  getPriceHistory: async (
    productId: number,
    startDate?: string,
    endDate?: string
  ): Promise<PriceEntry[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(
      `${API_BASE_URL}/products/${productId}/prices?${params.toString()}`
    );
    return response.data;
  },

  getPriceStatistics: async (productId: number): Promise<PriceStatistics> => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/statistics`);
    return response.data;
  },
};
