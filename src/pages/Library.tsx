
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Search,
  BookUp,
  BookDown,
  Filter,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

// Mock books data
const mockBooks = [
  { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', available: true, dueDate: null },
  { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: false, dueDate: '2024-04-30' },
  { id: '3', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', available: true, dueDate: null },
  { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', available: true, dueDate: null },
  { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', available: false, dueDate: '2024-04-28' },
  { id: '6', title: '1984', author: 'George Orwell', category: 'Science Fiction', available: true, dueDate: null },
  { id: '7', title: 'Animal Farm', author: 'George Orwell', category: 'Fiction', available: false, dueDate: '2024-05-10' },
  { id: '8', title: 'Lord of the Flies', author: 'William Golding', category: 'Fiction', available: true, dueDate: null },
  { id: '9', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', available: true, dueDate: null },
  { id: '10', title: 'The Da Vinci Code', author: 'Dan Brown', category: 'Mystery', available: false, dueDate: '2024-05-15' },
];

// Mock checkouts data
const mockCheckouts = [
  { id: '1', bookId: '2', studentName: 'Emma Johnson', checkoutDate: '2024-04-15', dueDate: '2024-04-30', returned: false },
  { id: '2', bookId: '5', studentName: 'Michael Chen', checkoutDate: '2024-04-12', dueDate: '2024-04-28', returned: false },
  { id: '3', bookId: '7', studentName: 'Sophia Martinez', checkoutDate: '2024-04-25', dueDate: '2024-05-10', returned: false },
  { id: '4', bookId: '10', studentName: 'Jackson Williams', checkoutDate: '2024-04-30', dueDate: '2024-05-15', returned: false },
];

const Library = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedBooks, setDisplayedBooks] = useState(mockBooks);
  const [activeTab, setActiveTab] = useState('books');
  
  // Filter books based on search term
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') {
      setDisplayedBooks(mockBooks);
      return;
    }
    
    const filtered = mockBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setDisplayedBooks(filtered);
  };
  
  const handleCheckoutBook = (bookId: string) => {
    // In a real app, this would make an API call
    alert(`Book with ID ${bookId} checked out successfully!`);
  };

  const handleReturnBook = (bookId: string) => {
    // In a real app, this would make an API call
    alert(`Book with ID ${bookId} returned successfully!`);
  };
  
  const isAdmin = user?.role === 'admin' || user?.role === 'volunteer';
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Library Management</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with statistics and filters */}
          <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Library Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Books:</span>
                    <span className="font-medium">{mockBooks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">{mockBooks.filter(book => book.available).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Checked Out:</span>
                    <span className="font-medium">{mockBooks.filter(book => !book.available).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search books..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1">
                  Search
                </Button>
              </div>
            </form>
            
            {isAdmin && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <BookUp size={16} />
                    Add New Book
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Filter size={16} />
                    Manage Categories
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Calendar size={16} />
                    Overdue Reports
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Card>
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`px-4 py-2 font-medium text-sm relative ${
                      activeTab === 'books' ? 'text-school-primary border-b-2 border-school-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab('books')}
                  >
                    All Books
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm relative ${
                      activeTab === 'checkouts' ? 'text-school-primary border-b-2 border-school-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab('checkouts')}
                  >
                    Checkouts
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {activeTab === 'books' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              {book.title}
                            </div>
                          </TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{book.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={book.available ? "outline" : "secondary"}
                              className={book.available ? "text-green-600 bg-green-50 hover:bg-green-50" : ""}
                            >
                              {book.available ? 'Available' : 'Checked Out'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {book.available ? (
                              <Button
                                size="sm"
                                onClick={() => handleCheckoutBook(book.id)}
                                disabled={!isAdmin}
                              >
                                Checkout
                              </Button>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleReturnBook(book.id)}
                                  disabled={!isAdmin}
                                  variant="outline"
                                >
                                  Return
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {activeTab === 'checkouts' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Checkout Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCheckouts.map((checkout) => {
                        const book = mockBooks.find(b => b.id === checkout.bookId);
                        
                        return (
                          <TableRow key={checkout.id}>
                            <TableCell className="font-medium">
                              {book?.title}
                            </TableCell>
                            <TableCell>{checkout.studentName}</TableCell>
                            <TableCell>
                              {new Date(checkout.checkoutDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(checkout.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {isAdmin ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReturnBook(checkout.bookId)}
                                >
                                  Mark Returned
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  {new Date(checkout.dueDate) < new Date() 
                                    ? 'Overdue'
                                    : `Due in ${Math.ceil((new Date(checkout.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Library;
