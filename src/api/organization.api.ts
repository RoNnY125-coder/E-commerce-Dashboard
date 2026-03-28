import apiClient from './apiClient';

export const organizationApi = {
  getOrgInfo: async () => {
    const res = await apiClient.get('/api/org');
    return res.data;
  },
  updateOrgInfo: async (data: any) => {
    const res = await apiClient.put('/api/org', data);
    return res.data;
  },
  getMembers: async () => {
    const res = await apiClient.get('/api/org/members');
    return res.data;
  }
};
