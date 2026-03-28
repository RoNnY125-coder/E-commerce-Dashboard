import apiClient from './apiClient';

export const analyticsApi = {
  getOverview: async (range: string) => {
    const res = await apiClient.get('/api/analytics', { params: { range } });
    return res.data; // Note: original backend sent data directly to dashboard
  },
  getDashboard: async (range: string) => {
    const res = await apiClient.get('/api/analytics/dashboard', { params: { range } });
    return res.data;
  }
};
