
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  const { user } = useAuth();
  
  // Determine where to redirect based on user role
  const homeLink = user?.role === 'student' ? '/performance' : '/attendance';
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-school-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-600">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="pt-4">
          <Link to={homeLink}>
            <Button className="gap-2">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
