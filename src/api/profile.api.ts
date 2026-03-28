import apiClient from './apiClient';

export const profileApi = {
  getProfile: async () => {
    const res = await apiClient.get('/api/profile');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await apiClient.put('/api/profile/update', data);
    return res.data;
  },
  changePassword: async (data: any) => {
    const res = await apiClient.put('/api/profile/change-password', data);
    return res.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await apiClient.post('/api/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getSessions: async () => {
    const res = await apiClient.get('/api/profile/sessions');
    return res.data;
  },
  revokeSession: async (id: string) => {
    const res = await apiClient.delete(`/api/profile/sessions/${id}`);
    return res.data;
  }
};
