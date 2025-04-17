
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, School } from 'lucide-react';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    // Redirect based on user role
    const redirectPath = user.role === 'student' ? '/performance' : '/attendance';
    return <Navigate to={redirectPath} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Demo account buttons to make login easier
  const loginWithDemoAccount = (role: string) => {
    let demoEmail = '';
    
    switch (role) {
      case 'admin':
        demoEmail = 'admin@school.com';
        break;
      case 'student':
        demoEmail = 'student@school.com';
        break;
      case 'volunteer':
        demoEmail = 'volunteer@school.com';
        break;
      default:
        return;
    }
    
    setEmail(demoEmail);
    setPassword('password');
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-school-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="bg-school-primary rounded-md p-3">
            <School className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold text-school-primary">SchoolHub</h1>
        <p className="text-center text-gray-600">School Management System</p>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Logging in...
                  </span>
                ) : 'Login'}
              </Button>
              
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground mb-2">Demo accounts for testing:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => loginWithDemoAccount('admin')}
                  >
                    Admin
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => loginWithDemoAccount('student')}
                  >
                    Student
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => loginWithDemoAccount('volunteer')}
                  >
                    Volunteer
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
