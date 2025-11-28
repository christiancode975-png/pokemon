import axios from 'axios';
import { Product, PriceEntry, PriceStatistics, PriceAlert, UserNote, CollectionValue } from './types';

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

  // Watchlist
  toggleWatchlist: async (productId: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/products/${productId}/watchlist`);
  },

  getWatchlist: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/watchlist/all`);
    return response.data;
  },

  // Price Alerts
  addPriceAlert: async (productId: number, alertData: Omit<PriceAlert, 'product_id' | 'id'>): Promise<void> => {
    await axios.post(`${API_BASE_URL}/products/${productId}/alerts`, alertData);
  },

  getPriceAlerts: async (productId: number): Promise<PriceAlert[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/alerts`);
    return response.data;
  },

  deletePriceAlert: async (alertId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/alerts/${alertId}`);
  },

  // Notes
  addNote: async (productId: number, note: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/products/${productId}/note`, { note });
  },

  getNote: async (productId: number): Promise<UserNote | null> => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/note`);
    return response.data;
  },

  deleteNote: async (productId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${productId}/note`);
  },

  // Collection
  getCollectionValue: async (): Promise<CollectionValue> => {
    const response = await axios.get(`${API_BASE_URL}/products/collection/value`);
    return response.data;
  },
};
