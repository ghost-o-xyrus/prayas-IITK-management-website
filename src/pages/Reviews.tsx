
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, SendHorizontal, MessageSquare, Star, Filter, User, ThumbsUp, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    reviewerId: '2',
    reviewerName: 'Student User',
    reviewerRole: 'student',
    targetId: '3',
    targetName: 'Volunteer User',
    targetRole: 'volunteer',
    rating: 5,
    comment: "Mr. Volunteer is an excellent teacher who takes time to ensure everyone understands the material.",
    date: '2024-03-15',
    likes: 3,
  },
  {
    id: '2',
    reviewerId: '3',
    reviewerName: 'Volunteer User',
    reviewerRole: 'volunteer',
    targetId: '1',
    targetName: 'Admin User',
    targetRole: 'admin',
    rating: 4,
    comment: "Admin is very supportive and provides all the resources needed for effective teaching.",
    date: '2024-02-20',
    likes: 2,
  },
  {
    id: '3',
    reviewerId: '1',
    reviewerName: 'Admin User',
    reviewerRole: 'admin',
    targetId: '2',
    targetName: 'Student User',
    targetRole: 'student',
    rating: 4,
    comment: "Student shows great dedication to their studies and actively participates in class.",
    date: '2024-01-10',
    likes: 1,
  },
  {
    id: '4',
    reviewerId: '7',
    reviewerName: 'Emily Davis',
    reviewerRole: 'student',
    targetId: '5',
    targetName: 'Sarah Johnson',
    targetRole: 'volunteer',
    rating: 5,
    comment: "Ms. Johnson makes history lessons fascinating with her storytelling approach. I've developed a newfound interest in the subject.",
    date: '2024-03-05',
    likes: 4,
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

const Reviews = () => {
  const { user, allUsers } = useAuth();
  const [newReview, setNewReview] = useState({
    targetId: '',
    rating: 0,
    comment: '',
  });
  const [filterRole, setFilterRole] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter users to exclude the current user
  const availableUsers = allUsers.filter(u => u.id !== user?.id);
  
  // Filter reviews based on active tab
  const getFilteredReviews = () => {
    let reviews = [...mockReviews];
    
    if (activeTab === 'mine') {
      reviews = reviews.filter(r => r.reviewerId === user?.id);
    } else if (activeTab === 'about-me') {
      reviews = reviews.filter(r => r.targetId === user?.id);
    }
    
    if (filterRole !== 'all') {
      reviews = reviews.filter(r => r.targetRole === filterRole);
    }
    
    return reviews;
  };
  
  const filteredReviews = getFilteredReviews();
  
  // Handle review form submission
  const handleSubmitReview = () => {
    if (!newReview.targetId) {
      toast.error('Please select a person to review');
      return;
    }
    
    if (newReview.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!newReview.comment || newReview.comment.length < 10) {
      toast.error('Please provide a detailed comment (at least 10 characters)');
      return;
    }
    
    // In a real app, this would send the review to the server
    toast.success('Review submitted successfully');
    
    // Reset the form
    setNewReview({
      targetId: '',
      rating: 0,
      comment: '',
    });
  };
  
  // Get user data by ID
  const getUserById = (id: string) => {
    return allUsers.find(u => u.id === id);
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
  
  const handleLikeReview = (id: string) => {
    toast.success('Review liked');
  };
  
  const handleReportReview = (id: string) => {
    toast.info('Review reported for review');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Submit New Review</CardTitle>
            <CardDescription>
              Share your experience with administrators, volunteers, or students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="target">Select Person to Review</Label>
                <Select 
                  value={newReview.targetId}
                  onValueChange={(value) => setNewReview({...newReview, targetId: value})}
                >
                  <SelectTrigger id="target" className="w-full">
                    <SelectValue placeholder="Select a person to review" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <span>{person.name}</span>
                          <Badge variant="outline" className="ml-1">
                            {getRoleDisplayName(person.role || '')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-2">
                  <StarRating 
                    rating={newReview.rating} 
                    onChange={(rating) => setNewReview({...newReview, rating})} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Review Comments</Label>
                <Textarea 
                  id="comment"
                  placeholder="Share your detailed experience..."
                  className="mt-2 min-h-[100px]"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                />
              </div>
              
              <Button
                className="w-full sm:w-auto gap-2"
                onClick={handleSubmitReview}
              >
                <SendHorizontal size={16} />
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="mine">My Reviews</TabsTrigger>
              <TabsTrigger value="about-me">About Me</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filterRole}
              onValueChange={setFilterRole}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="volunteer">Volunteers</SelectItem>
                <SelectItem value="student">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredReviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredReviews.map(review => {
              const targetUser = getUserById(review.targetId);
              const reviewerUser = getUserById(review.reviewerId);
              
              return (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${targetUser?.name}`} />
                          <AvatarFallback>{targetUser?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {targetUser?.name}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getRoleDisplayName(review.targetRole)}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Reviewed by {review.reviewerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-muted-foreground hover:text-blue-500"
                        onClick={() => handleLikeReview(review.id)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-muted-foreground hover:text-red-500"
                        onClick={() => handleReportReview(review.id)}
                      >
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-1">No reviews found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {activeTab === 'mine'
                  ? "You haven't submitted any reviews yet."
                  : activeTab === 'about-me'
                  ? "No one has reviewed you yet."
                  : filterRole !== 'all'
                  ? `No reviews found for ${getRoleDisplayName(filterRole)}s.`
                  : "No reviews have been submitted yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Reviews;
