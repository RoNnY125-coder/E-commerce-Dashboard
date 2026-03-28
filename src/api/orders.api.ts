import apiClient from './apiClient';

export const ordersApi = {
  getOrders: async (params: any) => {
    const res = await apiClient.get('/api/orders', { params });
    return res.data;
  },
  getOrder: async (id: string) => {
    const res = await apiClient.get(`/api/orders/${id}`);
    return res.data;
  },
  createOrder: async (data: any) => {
    const res = await apiClient.post('/api/orders', data);
    return res.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await apiClient.put(`/api/orders/${id}/status`, { status });
    return res.data;
  }
};
