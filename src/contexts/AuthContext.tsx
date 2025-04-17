
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'student' | 'volunteer' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  grade?: string;
  joinDate?: string;
  subjects?: string[];
  classId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
    phone: '555-123-4567',
    address: '123 Admin St, School City',
    joinDate: '2020-01-01',
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@school.com',
    role: 'student',
    phone: '555-234-5678',
    address: '456 Student Ave, School City',
    grade: '10th',
    joinDate: '2023-08-15',
    classId: 'C101',
  },
  {
    id: '3',
    name: 'Volunteer User',
    email: 'volunteer@school.com',
    role: 'volunteer',
    phone: '555-345-6789',
    address: '789 Volunteer Blvd, School City',
    subjects: ['Math', 'Science'],
    joinDate: '2022-03-10',
  },
  {
    id: '4',
    name: 'James Smith',
    email: 'james@school.com',
    role: 'student',
    phone: '555-987-6543',
    address: '101 Main St, School City',
    grade: '9th',
    joinDate: '2023-08-15',
    classId: 'C102',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sarah@school.com',
    role: 'volunteer',
    phone: '555-876-5432',
    address: '202 Oak Ave, School City',
    subjects: ['English', 'History'],
    joinDate: '2021-09-05',
  },
  {
    id: '6',
    name: 'Robert Williams',
    email: 'robert@school.com',
    role: 'admin',
    phone: '555-765-4321',
    address: '303 Pine Rd, School City',
    joinDate: '2019-06-12',
  },
  {
    id: '7',
    name: 'Emily Davis',
    email: 'emily@school.com',
    role: 'student',
    phone: '555-654-3210',
    address: '404 Maple Dr, School City',
    grade: '11th',
    joinDate: '2022-08-15',
    classId: 'C103',
  },
  {
    id: '8',
    name: 'Michael Brown',
    email: 'michael@school.com',
    role: 'volunteer',
    phone: '555-543-2109',
    address: '505 Cedar Ln, School City',
    subjects: ['Math', 'Computer Science'],
    joinDate: '2022-01-15',
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, allUsers: mockUsers }}>
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
