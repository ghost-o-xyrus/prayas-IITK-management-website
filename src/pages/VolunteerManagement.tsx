
import { useState } from 'react';
import { 
  User, 
  Trash2, 
  Pencil, 
  Search, 
  UserPlus,
  UserCog,
  Calendar,
  Save,
  BookOpen
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VolunteerManagement = () => {
  const { allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Filter only volunteers
  const volunteers = allUsers.filter(user => user.role === 'volunteer');
  
  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.subjects?.some(subject => 
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) || false
  );

  // Mock function for deleting a volunteer
  const handleDeleteVolunteer = (id: string) => {
    toast.success('Volunteer deleted successfully');
  };

  // Mock function for editing a volunteer
  const handleEditVolunteer = (id: string) => {
    setIsEditing(id);
    toast.info('Now editing volunteer information');
  };

  // Mock function for saving edits
  const handleSaveEdit = (id: string) => {
    setIsEditing(null);
    toast.success('Volunteer information updated successfully');
  };

  // Mock function for adding a new volunteer
  const handleAddVolunteer = () => {
    toast.success('New volunteer added successfully');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Volunteer Management</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus size={16} />
                Add New Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Volunteer</DialogTitle>
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
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input id="joinDate" type="date" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter home address" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects</Label>
                  <Input id="subjects" placeholder="Enter subjects (comma-separated)" />
                </div>
                
                <Button className="w-full" onClick={handleAddVolunteer}>Add Volunteer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search volunteers by name, email or subject..."
            className="pl-8 mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              <span>Volunteers List</span>
              <Badge variant="outline" className="ml-2">
                {filteredVolunteers.length} volunteers
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVolunteers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell>
                          {isEditing === volunteer.id ? (
                            <Input defaultValue={volunteer.name} className="w-full" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {volunteer.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === volunteer.id ? (
                            <Input defaultValue={volunteer.email} className="w-full" />
                          ) : (
                            volunteer.email
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === volunteer.id ? (
                            <Input defaultValue={volunteer.subjects?.join(', ')} className="w-full" />
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {volunteer.subjects?.map((subject, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === volunteer.id ? (
                            <Input defaultValue={volunteer.phone} className="w-full" />
                          ) : (
                            volunteer.phone
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing === volunteer.id ? (
                            <Input defaultValue={volunteer.joinDate} className="w-full" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(volunteer.joinDate || '').toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isEditing === volunteer.id ? (
                              <Button size="sm" onClick={() => handleSaveEdit(volunteer.id)}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditVolunteer(volunteer.id)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeleteVolunteer(volunteer.id)}>
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
                <h3 className="text-lg font-medium mb-1">No volunteers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Add your first volunteer to get started'}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus size={16} />
                      Add New Volunteer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Add volunteer form (same as above) */}
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

export default VolunteerManagement;
