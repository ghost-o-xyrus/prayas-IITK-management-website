
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
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
  BarChart as ChartIcon,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock student performance data
const mockPerformanceData = {
  student: {
    id: '2',
    name: 'Student User',
    grade: '10A',
    averageGrade: 85,
    rank: 4,
    attendance: 95,
  },
  subjects: [
    { id: '1', name: 'Mathematics', grade: 88, previousGrade: 82, trend: 'up' },
    { id: '2', name: 'Science', grade: 92, previousGrade: 94, trend: 'down' },
    { id: '3', name: 'English', grade: 85, previousGrade: 85, trend: 'stable' },
    { id: '4', name: 'History', grade: 78, previousGrade: 72, trend: 'up' },
    { id: '5', name: 'Geography', grade: 82, previousGrade: 79, trend: 'up' },
  ],
  chartData: [
    { month: 'Jan', grade: 82 },
    { month: 'Feb', grade: 84 },
    { month: 'Mar', grade: 83 },
    { month: 'Apr', grade: 85 },
    { month: 'May', grade: 87 },
  ],
  achievements: [
    { id: '1', name: 'Perfect Attendance', date: '2024-02-15', description: 'No absences for the entire month.' },
    { id: '2', name: 'Science Fair Winner', date: '2024-03-10', description: 'First place in the annual science fair.' },
    { id: '3', name: 'Reading Challenge', date: '2024-04-05', description: 'Read 15 books this semester.' },
  ],
};

// Mock class data for admin/volunteer view
const mockClassData = [
  { id: '1', name: 'Emma Johnson', grade: '10A', averageGrade: 92, attendance: 98, rank: 1 },
  { id: '2', name: 'Student User', grade: '10A', averageGrade: 85, attendance: 95, rank: 4 },
  { id: '3', name: 'Michael Chen', grade: '10A', averageGrade: 90, attendance: 97, rank: 2 },
  { id: '4', name: 'Sophia Martinez', grade: '10A', averageGrade: 88, attendance: 96, rank: 3 },
  { id: '5', name: 'Jackson Williams', grade: '10A', averageGrade: 82, attendance: 93, rank: 5 },
  { id: '6', name: 'Olivia Brown', grade: '10A', averageGrade: 79, attendance: 90, rank: 7 },
  { id: '7', name: 'Ethan Davis', grade: '10A', averageGrade: 81, attendance: 91, rank: 6 },
  { id: '8', name: 'Ava Rodriguez', grade: '10A', averageGrade: 77, attendance: 88, rank: 8 },
];

const Performance = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const studentData = mockPerformanceData;
  const isAdmin = user?.role === 'admin' || user?.role === 'volunteer';
  const classData = mockClassData;
  
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getGradeDifference = (current: number, previous: number) => {
    const difference = current - previous;
    return (
      <span className={difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'}>
        {difference > 0 ? `+${difference}` : difference}
      </span>
    );
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Academic Performance</h1>
        </div>
        
        {/* Student View */}
        {isStudent && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  <ChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.averageGrade}%</div>
                  <p className="text-xs text-muted-foreground">Class Average: 84%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.rank}/{mockClassData.length}</div>
                  <p className="text-xs text-muted-foreground">Top {Math.round((studentData.rank / mockClassData.length) * 100)}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <ChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.attendance}%</div>
                  <p className="text-xs text-muted-foreground">Class Average: 93%</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Subject Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Previous</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData.subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell className={getGradeColor(subject.grade)}>{subject.grade}%</TableCell>
                          <TableCell>{subject.previousGrade}% {getGradeDifference(subject.grade, subject.previousGrade)}</TableCell>
                          <TableCell>{getTrendIcon(subject.trend)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={studentData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Bar dataKey="grade" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Awarded on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Admin/Volunteer View */}
        {isAdmin && (
          <Tabs defaultValue="class">
            <TabsList className="mb-4">
              <TabsTrigger value="class">Class Overview</TabsTrigger>
              <TabsTrigger value="student">Student Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="class">
              <Card>
                <CardHeader>
                  <CardTitle>Class 10A Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Average Grade</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classData.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rank}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className={getGradeColor(student.averageGrade)}>
                              {student.averageGrade}%
                            </TableCell>
                            <TableCell>{student.attendance}%</TableCell>
                            <TableCell>
                              {student.averageGrade >= 90 ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
                              ) : student.averageGrade >= 80 ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>
                              ) : student.averageGrade >= 70 ? (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Average</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needs Improvement</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Class Performance Summary</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={classData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar dataKey="averageGrade" name="Average Grade" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">Select a student from the class overview to see detailed performance.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Performance;
