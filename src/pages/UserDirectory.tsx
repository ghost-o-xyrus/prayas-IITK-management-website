
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth, User as UserType } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  UserCheck,
  GraduationCap,
  Users,
  Building
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserDirectory = () => {
  const { allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter users based on search term and active tab
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.grade && user.grade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.subjects && user.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'students' && user.role === 'student') ||
      (activeTab === 'volunteers' && user.role === 'volunteer') ||
      (activeTab === 'admins' && user.role === 'admin');
    
    return matchesSearch && matchesTab;
  });
  
  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'volunteer':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'student':
        return <GraduationCap className="h-5 w-5 text-amber-500" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };
  
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'volunteer':
        return 'Volunteer Teacher';
      case 'student':
        return 'Student';
      default:
        return role;
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Directory</h1>
          <Badge variant="outline" className="px-3 py-1 text-base font-normal">
            <Users className="h-4 w-4 mr-2" />
            {allUsers.length} Users
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, phone, grade or subject..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardContent className="p-4">
            {filteredUsers.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredUsers.map((user) => (
                  <AccordionItem key={user.id} value={user.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                          <span className="font-medium">{user.name}</span>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role || '')}
                            <span className="text-sm text-muted-foreground">
                              {getRoleDisplayName(user.role || '')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Email:</span>
                              <span className="text-sm font-medium">{user.email}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Phone:</span>
                              <span className="text-sm font-medium">{user.phone || 'Not provided'}</span>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm">Address:</span>
                              <span className="text-sm font-medium">{user.address || 'Not provided'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Join Date:</span>
                              <span className="text-sm font-medium">
                                {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not provided'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {user.role === 'student' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Grade:</span>
                                  <span className="text-sm font-medium">{user.grade || 'Not assigned'}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Class ID:</span>
                                  <span className="text-sm font-medium">{user.classId || 'Not assigned'}</span>
                                </div>
                              </>
                            )}
                            
                            {user.role === 'volunteer' && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Subjects:</span>
                                <div className="flex flex-wrap gap-1">
                                  {user.subjects?.map((subject, index) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                                      {subject}
                                    </Badge>
                                  )) || 'None assigned'}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-1">No users found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserDirectory;
