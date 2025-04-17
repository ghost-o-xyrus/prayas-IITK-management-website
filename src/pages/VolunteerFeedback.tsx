
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, SendHorizontal, MessageSquare, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock volunteer data
const volunteers = [
  {
    id: '3',
    name: 'Volunteer User',
    email: 'volunteer@school.com',
    subjects: ['Math', 'Science'],
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sarah@school.com',
    subjects: ['English', 'History'],
  },
  {
    id: '8',
    name: 'Michael Brown',
    email: 'michael@school.com',
    subjects: ['Math', 'Computer Science'],
  },
];

// Mock feedback data
const mockFeedback = [
  {
    id: '1',
    volunteerId: '5',
    studentId: '2',
    rating: 5,
    comment: "Ms. Johnson is an excellent teacher who explains English literature concepts very clearly. Her feedback on my essays has been incredibly helpful.",
    date: '2024-03-15',
    subject: 'English',
  },
  {
    id: '2',
    volunteerId: '3',
    studentId: '2',
    rating: 4,
    comment: "I appreciate the extra time Mr. Volunteer takes to explain difficult math problems. Would appreciate more practice problems to work on at home.",
    date: '2024-02-20',
    subject: 'Math',
  },
  {
    id: '3',
    volunteerId: '8',
    studentId: '2',
    rating: 5,
    comment: "Mr. Brown makes computer science lessons fun and engaging. The coding projects are interesting and I've learned a lot.",
    date: '2024-01-10',
    subject: 'Computer Science',
  },
];

const StarRating = ({ 
  rating, 
  onChange 
}: { 
  rating: number; 
  onChange: (newRating: number) => void 
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="focus:outline-none"
        >
          <StarIcon 
            className={`h-6 w-6 ${value <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        </button>
      ))}
    </div>
  );
};

const VolunteerFeedback = () => {
  const { user } = useAuth();
  const [newFeedback, setNewFeedback] = useState({
    volunteerId: '',
    rating: 0,
    comment: '',
    subject: '',
  });
  const [filterSubject, setFilterSubject] = useState<string>('all');
  
  // Get unique subjects from volunteers
  const subjects = Array.from(
    new Set(volunteers.flatMap(volunteer => volunteer.subjects || []))
  );
  
  // Filter feedback to show only feedback from the current student
  const myFeedback = mockFeedback.filter(f => f.studentId === user?.id);
  
  // Further filter by subject if selected
  const filteredFeedback = filterSubject === 'all'
    ? myFeedback
    : myFeedback.filter(f => f.subject === filterSubject);
  
  // Handle feedback form submission
  const handleSubmitFeedback = () => {
    if (!newFeedback.volunteerId) {
      toast.error('Please select a volunteer');
      return;
    }
    
    if (newFeedback.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!newFeedback.subject) {
      toast.error('Please select a subject');
      return;
    }
    
    // In a real app, this would send the feedback to the server
    toast.success('Feedback submitted successfully');
    
    // Reset the form
    setNewFeedback({
      volunteerId: '',
      rating: 0,
      comment: '',
      subject: '',
    });
  };
  
  // Get volunteer data by ID
  const getVolunteerById = (id: string) => {
    return volunteers.find(v => v.id === id);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Volunteer Feedback</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Submit New Feedback</CardTitle>
            <CardDescription>
              Provide feedback to help our volunteers improve their teaching methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="volunteer">Select Volunteer</Label>
                <Select 
                  value={newFeedback.volunteerId}
                  onValueChange={(value) => setNewFeedback({...newFeedback, volunteerId: value})}
                >
                  <SelectTrigger id="volunteer" className="w-full">
                    <SelectValue placeholder="Select a volunteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers.map(volunteer => (
                      <SelectItem key={volunteer.id} value={volunteer.id}>
                        {volunteer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newFeedback.volunteerId && (
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={newFeedback.subject}
                    onValueChange={(value) => setNewFeedback({...newFeedback, subject: value})}
                  >
                    <SelectTrigger id="subject" className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVolunteerById(newFeedback.volunteerId)?.subjects?.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-2">
                  <StarRating 
                    rating={newFeedback.rating} 
                    onChange={(rating) => setNewFeedback({...newFeedback, rating})} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Comments</Label>
                <Textarea 
                  id="comment"
                  placeholder="Share your experience with this volunteer..."
                  className="mt-2 min-h-[100px]"
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                />
              </div>
              
              <Button
                className="w-full sm:w-auto gap-2"
                onClick={handleSubmitFeedback}
              >
                <SendHorizontal size={16} />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Previous Feedback</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filterSubject}
              onValueChange={setFilterSubject}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredFeedback.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredFeedback.map(feedback => {
              const volunteer = getVolunteerById(feedback.volunteerId);
              return (
                <Card key={feedback.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${volunteer?.name}`} />
                          <AvatarFallback>{volunteer?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{volunteer?.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{feedback.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                      <p className="text-sm">{feedback.comment}</p>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Submitted on {new Date(feedback.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-1">No feedback found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {filterSubject !== 'all'
                  ? `You haven't provided any feedback for ${filterSubject} yet. Try selecting a different subject or submit new feedback.`
                  : "You haven't provided any feedback yet. Use the form above to share your experiences with our volunteers."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default VolunteerFeedback;
