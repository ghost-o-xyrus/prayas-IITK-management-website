
import { useState } from 'react';
import { 
  User, 
  Trash2, 
  Pencil, 
  Search, 
  UserPlus,
  GraduationCap,
  Save
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useAuth, User as UserType } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const StudentManagement = () => {
  const { allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Filter only students
  const students = allUsers.filter(user => user.role === 'student');
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock function for deleting a student
  const handleDeleteStudent = (id: string) => {
    toast.success('Student deleted successfully');
  };

  // Mock function for editing a student
  const handleEditStudent = (id: string) => {
    setIsEditing(id);
    toast.info('Now editing student information');
  };

  // Mock function for saving edits
  const handleSaveEdit = (id: string) => {
    setIsEditing(null);
    toast.success('Student information updated successfully');
  };

  // Mock function for adding a new student
  const handleAddStudent = () => {
    toast.success('New student added successfully');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Management</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus size={16} />
                Add New Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" placeholder="Enter grade" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter home address" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class ID</Label>
                  <Input id="class" placeholder="Enter class ID" />
                </div>
                
                <Button className="w-full" onClick={handleAddStudent}>Add Student</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email or grade..."
            className="pl-8 mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span>Students List</span>
              <Badge variant="outline" className="ml-2">
                {filteredStudents.length} students
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Class ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          {isEditing === student.id ? (
                            <Input defaultValue={student.name} className="w-full" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {student.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === student.id ? (
                            <Input defaultValue={student.email} className="w-full" />
                          ) : (
                            student.email
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === student.id ? (
                            <Input defaultValue={student.grade} className="w-full" />
                          ) : (
                            student.grade
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === student.id ? (
                            <Input defaultValue={student.phone} className="w-full" />
                          ) : (
                            student.phone
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === student.id ? (
                            <Input defaultValue={student.classId} className="w-full" />
                          ) : (
                            student.classId
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isEditing === student.id ? (
                              <Button size="sm" onClick={() => handleSaveEdit(student.id)}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditStudent(student.id)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-1">No students found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Add your first student to get started'}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus size={16} />
                      Add New Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Add student form (same as above) */}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudentManagement;
