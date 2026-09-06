import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, user, handleGetMe } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token && !user) {
      handleGetMe();
    }
  }, [token, user, handleGetMe]);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
export { ProtectedRoute };
