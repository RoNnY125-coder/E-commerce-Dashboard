import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only check auth once on mount if we're not authenticated but have a token
    // Alternatively, you can rely purely on React Query if you refactor, 
    // but this is a solid standard approach.
    const token = useAuthStore.getState().accessToken;
    if (!isAuthenticated && token) {
      checkAuth();
    } else if (isLoading) {
      // If we are loading but don't have a token, we can just stop loading
      if (!token) {
        useAuthStore.setState({ isLoading: false });
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
