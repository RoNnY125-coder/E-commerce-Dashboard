import apiClient from './apiClient';

export const productsApi = {
  getProducts: async (params: any) => {
    const res = await apiClient.get('/api/products', { params });
    return res.data;
  },
  getProduct: async (id: string) => {
    const res = await apiClient.get(`/api/products/${id}`);
    return res.data;
  },
  createProduct: async (data: any) => {
    const res = await apiClient.post('/api/products', data);
    return res.data;
  },
  updateProduct: async (id: string, data: any) => {
    const res = await apiClient.put(`/api/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await apiClient.delete(`/api/products/${id}`);
    return res.data;
  }
};
