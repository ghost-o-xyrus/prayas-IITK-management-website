
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // If still loading authentication state, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user doesn't have the required role
  if (allowedRoles.length > 0 && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Special case for volunteers and document access
  if (user.role === 'volunteer' && location.pathname === '/information') {
    // Restrict volunteer access to student documents
    // The internal component will handle hiding certain sections
  }
  
  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
