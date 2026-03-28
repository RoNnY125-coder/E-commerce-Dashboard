import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true, // For cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // If the backend wraps responses in { success: true, data: ... }
    // we can safely pull it out or let APIs handle it.
    // For now we just return the full axios response object
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token
        // The refresh token is in an httpOnly cookie, so we just send the request
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );

        if (res.data?.success && res.data?.data?.accessToken) {
          const newToken = res.data.data.accessToken;
          
          // Update store
          useAuthStore.getState().setToken(newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, meaning session is truly dead
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
