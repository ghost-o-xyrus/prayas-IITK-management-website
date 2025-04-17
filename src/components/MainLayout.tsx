
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Users, 
  BarChart, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const SidebarItem = ({ to, label, icon, active }: SidebarItemProps) => (
  <Link to={to} className="w-full">
    <Button
      variant={active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        active ? "bg-school-primary text-white" : ""
      )}
    >
      {icon}
      {label}
    </Button>
  </Link>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    {
      to: "/attendance",
      label: "Attendance",
      icon: <Calendar size={18} />,
      roles: ["admin", "volunteer"]
    },
    {
      to: "/library",
      label: "Library",
      icon: <BookOpen size={18} />,
      roles: ["admin", "volunteer", "student"]
    },
    {
      to: "/performance",
      label: "Performance",
      icon: <BarChart size={18} />,
      roles: ["admin", "volunteer", "student"]
    },
    {
      to: "/documents",
      label: "Documents",
      icon: <FileText size={18} />,
      roles: ["admin", "volunteer", "student"]
    },
    {
      to: "/test-scores",
      label: "Test Scores",
      icon: <BarChart size={18} />,
      roles: ["admin", "volunteer"]
    }
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );
  
  return (
    <div className="flex min-h-screen bg-school-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Sidebar - Desktop and mobile versions */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* School logo and name */}
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="bg-school-primary rounded-md p-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">SchoolHub</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation items */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                to={item.to} 
                label={item.label} 
                icon={item.icon} 
                active={location.pathname === item.to}
              />
            ))}
          </nav>
          
          {/* Logout button */}
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-muted-foreground" 
              onClick={logout}
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 p-6 lg:ml-64",
        "transition-all duration-300 ease-in-out"
      )}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
