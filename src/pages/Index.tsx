
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { School } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-school-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect based on role
  if (user) {
    // Redirect to different pages based on user role
    if (user.role === 'student') {
      return <Navigate to="/performance" replace />;
    } else if (user.role === 'volunteer') {
      return <Navigate to="/attendance" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/user-directory" replace />;
    }
  }

  // If not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
