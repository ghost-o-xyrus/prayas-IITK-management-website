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
          <img 
            src="/lovable-uploads/444dafee-a6d5-4249-8b3e-c2c4d6358380.png" 
            alt="Prayas IITK Logo" 
            className="animate-spin h-12 w-12 mx-auto mb-4"
          />
          <p className="text-gray-600">Loading Prayas IITK...</p>
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
