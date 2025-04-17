
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Plus, 
  File, 
  FileImage, 
  File as FilePdf, 
  FileSpreadsheet,
  Trash2, 
  Upload,
  Search,
  FolderOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock document data
const mockDocuments = [
  { id: '1', name: 'Medical Certificate.pdf', type: 'pdf', size: '1.2 MB', uploadedBy: 'Emma Johnson', uploadDate: '2024-03-15', category: 'Medical' },
  { id: '2', name: 'School ID Card.jpg', type: 'image', size: '0.8 MB', uploadedBy: 'Emma Johnson', uploadDate: '2024-02-20', category: 'Identification' },
  { id: '3', name: 'Previous School Records.pdf', type: 'pdf', size: '2.5 MB', uploadedBy: 'Admin User', uploadDate: '2024-01-10', category: 'Academic' },
  { id: '4', name: 'Vaccination Record.pdf', type: 'pdf', size: '1.0 MB', uploadedBy: 'Admin User', uploadDate: '2024-01-15', category: 'Medical' },
  { id: '5', name: 'Parent Consent Form.docx', type: 'document', size: '0.5 MB', uploadedBy: 'Emma Johnson', uploadDate: '2024-03-01', category: 'Forms' },
  { id: '6', name: 'Scholarship Application.pdf', type: 'pdf', size: '1.5 MB', uploadedBy: 'Admin User', uploadDate: '2024-02-28', category: 'Financial' },
];

// Mock class-wide documents (only visible to admin/volunteer)
const mockClassDocuments = [
  { id: '1', name: 'Class Schedule.xlsx', type: 'spreadsheet', size: '0.7 MB', uploadedBy: 'Admin User', uploadDate: '2024-01-05', category: 'Academic' },
  { id: '2', name: 'Field Trip Permission Forms.pdf', type: 'pdf', size: '1.8 MB', uploadedBy: 'Admin User', uploadDate: '2024-03-10', category: 'Forms' },
  { id: '3', name: 'Curriculum Overview.pdf', type: 'pdf', size: '2.2 MB', uploadedBy: 'Admin User', uploadDate: '2024-01-08', category: 'Academic' },
];

const Documents = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isAdmin = user?.role === 'admin' || user?.role === 'volunteer';
  
  // Get all unique categories from documents
  const categories = ['All', ...new Set([...mockDocuments, ...(isAdmin ? mockClassDocuments : [])].map(doc => doc.category))];
  
  // Filter documents based on search term and category
  const filterDocuments = (documents: typeof mockDocuments) => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  const filteredStudentDocs = filterDocuments(mockDocuments);
  const filteredClassDocs = isAdmin ? filterDocuments(mockClassDocuments) : [];
  
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleUploadFile = () => {
    // In a real app, this would open a file dialog and handle the upload
    toast.success('File uploaded successfully!');
  };
  
  const handleDeleteFile = (id: string) => {
    // In a real app, this would delete the file
    toast.success('File deleted successfully!');
  };
  
  const handleDownloadFile = (id: string) => {
    // In a real app, this would download the file
    toast.success('File download started!');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documents</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button variant="outline" className="mt-4">
                    Select Files
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Document Category</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      {categories.filter(c => c !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="private">Private</option>
                      <option value="public">Public to Class</option>
                    </select>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleUploadFile}>Upload Document</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filter and search bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Documents list */}
        <Tabs defaultValue="student">
          <TabsList>
            <TabsTrigger value="student">Student Documents</TabsTrigger>
            {isAdmin && <TabsTrigger value="class">Class Documents</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredStudentDocs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Uploaded On</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudentDocs.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFileIcon(doc.type)}
                                <span>{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.category}</Badge>
                            </TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                            <TableCell>{doc.uploadedBy}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleDownloadFile(doc.id)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                {isAdmin && (
                                  <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDeleteFile(doc.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-1">No documents found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm || selectedCategory !== 'All' 
                        ? 'Try changing your search or filter criteria'
                        : 'Upload your first document to get started'}
                    </p>
                    <Button className="gap-2">
                      <Plus size={16} />
                      Upload Document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="class">
              <Card>
                <CardHeader>
                  <CardTitle>Class Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredClassDocs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Uploaded On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClassDocs.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getFileIcon(doc.type)}
                                  <span>{doc.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.category}</Badge>
                              </TableCell>
                              <TableCell>{doc.size}</TableCell>
                              <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="icon" onClick={() => handleDownloadFile(doc.id)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDeleteFile(doc.id)}>
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
                      <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium mb-1">No class documents found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm || selectedCategory !== 'All' 
                          ? 'Try changing your search or filter criteria'
                          : 'Upload class documents for all students to access'}
                      </p>
                      <Button className="gap-2">
                        <Plus size={16} />
                        Upload Class Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Documents;
