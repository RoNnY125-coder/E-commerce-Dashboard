import apiClient from './apiClient';

export const customersApi = {
  getCustomers: async (params: any) => {
    const res = await apiClient.get('/api/customers', { params });
    return res.data;
  },
  getCustomer: async (id: string) => {
    const res = await apiClient.get(`/api/customers/${id}`);
    return res.data;
  },
  createCustomer: async (data: any) => {
    const res = await apiClient.post('/api/customers', data);
    return res.data;
  },
  updateCustomer: async (id: string, data: any) => {
    const res = await apiClient.put(`/api/customers/${id}`, data);
    return res.data;
  },
  deleteCustomer: async (id: string) => {
    const res = await apiClient.delete(`/api/customers/${id}`);
    return res.data;
  }
};
