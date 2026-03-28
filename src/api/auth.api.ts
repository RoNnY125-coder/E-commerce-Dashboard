import apiClient from './apiClient';

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};
