
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'student' | 'volunteer' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@school.com',
    role: 'student',
  },
  {
    id: '3',
    name: 'Volunteer User',
    email: 'volunteer@school.com',
    role: 'volunteer',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a user is already logged in (from localStorage in a real app)
    const storedUser = localStorage.getItem('schoolUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (password would be validated on server in real app)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Set user in state
      setUser(foundUser);
      
      // Store user in localStorage for persistence
      localStorage.setItem('schoolUser', JSON.stringify(foundUser));
      
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      toast.error('Failed to login: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user from state
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('schoolUser');
    
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
