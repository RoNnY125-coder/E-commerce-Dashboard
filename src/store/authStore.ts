import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth.api';

interface AuthState {
  user: any | null;
  organization: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setToken: (token: string) => void;
  setAuthData: (data: { user: any; org: any; accessToken: string }) => void;
  updateUser: (user: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true, // Start true so we can check auth on load

      setToken: (token) => set({ accessToken: token }),
      
      setAuthData: ({ user, org, accessToken }) => 
        set({ user, organization: org, accessToken, isAuthenticated: true }),
      
      updateUser: (user) => set({ user }),

      logout: () => {
        authApi.logout().catch(console.error); // Best effort
        set({ user: null, organization: null, accessToken: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            set({ 
              user: res.data.user, 
              organization: res.data.org, 
              isAuthenticated: true 
            });
          } else {
            set({ isAuthenticated: false, user: null, organization: null, accessToken: null });
          }
        } catch (error) {
          set({ isAuthenticated: false, user: null, organization: null, accessToken: null });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'ecommerce-auth',
      partialize: (state) => ({ accessToken: state.accessToken }), // Only persist the token
    }
  )
);
