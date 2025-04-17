
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart as BarChartIcon,
  FileSpreadsheet,
  Upload,
  Download,
  ChevronDown,
  TrendingUp,
  Plus,
  Users,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock students
const mockStudents = [
  { id: '1', name: 'Emma Johnson', grade: '10A' },
  { id: '2', name: 'Michael Chen', grade: '10A' },
  { id: '3', name: 'Sophia Martinez', grade: '10A' },
  { id: '4', name: 'Jackson Williams', grade: '10A' },
  { id: '5', name: 'Olivia Brown', grade: '10A' },
  { id: '6', name: 'Ethan Davis', grade: '10A' },
  { id: '7', name: 'Ava Rodriguez', grade: '10A' },
  { id: '8', name: 'Noah Wilson', grade: '10A' },
];

// Mock test types
const testTypes = [
  { id: '1', name: 'Midterm Exam' },
  { id: '2', name: 'Final Exam' },
  { id: '3', name: 'Quiz 1' },
  { id: '4', name: 'Quiz 2' },
  { id: '5', name: 'Project Assessment' },
];

// Mock subjects
const subjects = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'English' },
  { id: '4', name: 'History' },
  { id: '5', name: 'Geography' },
];

// Mock test scores
const generateMockScores = () => {
  const scores = [];
  
  for (const student of mockStudents) {
    for (const subject of subjects) {
      const midtermScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const finalScore = midtermScore + (Math.floor(Math.random() * 20) - 10); // +/- 10 from midterm
      
      scores.push({
        id: `mid-${student.id}-${subject.id}`,
        studentId: student.id,
        studentName: student.name,
        subjectId: subject.id,
        subjectName: subject.name,
        testType: 'Midterm Exam',
        date: '2024-02-15',
        score: midtermScore,
        maxScore: 100,
        previousScore: null,
      });
      
      scores.push({
        id: `final-${student.id}-${subject.id}`,
        studentId: student.id,
        studentName: student.name,
        subjectId: subject.id,
        subjectName: subject.name,
        testType: 'Final Exam',
        date: '2024-04-15',
        score: finalScore,
        maxScore: 100,
        previousScore: midtermScore,
      });
    }
  }
  
  return scores;
};

const mockScores = generateMockScores();

const TestScores = () => {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTestType, setSelectedTestType] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  // Filter scores based on selected filters
  const filteredScores = mockScores.filter(score => {
    const matchesSubject = selectedSubject === 'All' || score.subjectName === selectedSubject;
    const matchesTestType = selectedTestType === 'All' || score.testType === selectedTestType;
    const matchesStudent = !selectedStudent || score.studentId === selectedStudent;
    
    return matchesSubject && matchesTestType && (matchesStudent || !selectedStudent);
  });
  
  // Generate student performance data for charts
  const generateStudentPerformanceData = () => {
    if (!selectedStudent) return [];
    
    // Get this student's scores
    const studentScores = mockScores.filter(score => score.studentId === selectedStudent);
    const performanceBySubject = subjects.map(subject => {
      const subjectScores = studentScores.filter(score => score.subjectName === subject.name);
      const midterm = subjectScores.find(score => score.testType === 'Midterm Exam')?.score || 0;
      const final = subjectScores.find(score => score.testType === 'Final Exam')?.score || 0;
      const improvement = final - midterm;
      const improvementPercent = midterm > 0 ? ((improvement / midterm) * 100).toFixed(1) : '0.0';
      
      return {
        subject: subject.name,
        midterm,
        final,
        improvement,
        improvementPercent
      };
    });
    
    return performanceBySubject;
  };
  
  // Generate class performance data for charts
  const generateClassPerformanceData = () => {
    const subjectData = subjects.map(subject => {
      const subjectScores = mockScores.filter(score => score.subjectName === subject.name);
      const midtermScores = subjectScores.filter(score => score.testType === 'Midterm Exam');
      const finalScores = subjectScores.filter(score => score.testType === 'Final Exam');
      
      const midtermAverage = midtermScores.length > 0 
        ? midtermScores.reduce((sum, score) => sum + score.score, 0) / midtermScores.length 
        : 0;
        
      const finalAverage = finalScores.length > 0 
        ? finalScores.reduce((sum, score) => sum + score.score, 0) / finalScores.length 
        : 0;
        
      const improvement = finalAverage - midtermAverage;
      const improvementPercent = midtermAverage > 0 ? ((improvement / midtermAverage) * 100).toFixed(1) : '0.0';
      
      return {
        subject: subject.name,
        midtermAverage: Math.round(midtermAverage),
        finalAverage: Math.round(finalAverage),
        improvement,
        improvementPercent
      };
    });
    
    return subjectData;
  };
  
  // Calculate improvement statistics
  const calculateImprovementStats = () => {
    // Filter scores to get only the ones with previous scores
    const scoresWithImprovement = filteredScores.filter(score => score.previousScore !== null);
    
    if (scoresWithImprovement.length === 0) {
      return { totalImprovement: 0, averageImprovement: 0, percentImproved: 0 };
    }
    
    const improvements = scoresWithImprovement.map(score => score.score - (score.previousScore || 0));
    const totalImprovement = improvements.reduce((sum, val) => sum + val, 0);
    const averageImprovement = totalImprovement / improvements.length;
    const improvedCount = improvements.filter(imp => imp > 0).length;
    const percentImproved = (improvedCount / improvements.length) * 100;
    
    return {
      totalImprovement,
      averageImprovement,
      percentImproved
    };
  };
  
  const improvementStats = calculateImprovementStats();
  const studentPerformanceData = generateStudentPerformanceData();
  const classPerformanceData = generateClassPerformanceData();
  
  // Handle uploading new scores
  const handleUploadScores = () => {
    // In a real app, this would handle file upload and processing
    toast.success('Test scores uploaded successfully!');
  };
  
  // Handle downloading score templates
  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV or Excel template
    toast.success('Template downloaded successfully!');
  };
  
  // Format score with improvement indicator
  const formatScoreWithImprovement = (score: number, previousScore: number | null) => {
    if (previousScore === null) return score;
    
    const improvement = score - previousScore;
    const improvementText = improvement > 0 
      ? <span className="text-green-500 ml-1">↑{improvement}</span> 
      : improvement < 0 
        ? <span className="text-red-500 ml-1">↓{Math.abs(improvement)}</span>
        : <span className="text-gray-500 ml-1">→0</span>;
    
    return (
      <div className="flex items-center">
        {score}{improvementText}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Test Scores & Analytics</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4" />
              Template
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Scores
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Test Scores</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select className="w-full p-2 border rounded-md">
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.name}>{subject.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Test Type</label>
                      <select className="w-full p-2 border rounded-md">
                        {testTypes.map(type => (
                          <option key={type.id} value={type.name}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <FileSpreadsheet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a CSV or Excel file, or click to browse
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Select File
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleUploadScores}>Upload Scores</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Test Type</label>
            <Select value={selectedTestType} onValueChange={setSelectedTestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Test Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Tests</SelectItem>
                {testTypes.map(type => (
                  <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Student (Optional)</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Students</SelectItem>
                {mockStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredScores.length > 0 
                  ? Math.round(filteredScores.reduce((sum, score) => sum + score.score, 0) / filteredScores.length) 
                  : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {filteredScores.length > 0 ? filteredScores[0].maxScore : 100} points
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {improvementStats.averageImprovement.toFixed(1)} pts
              </div>
              <p className="text-xs text-muted-foreground">
                {improvementStats.percentImproved.toFixed(1)}% of students improved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredScores.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(filteredScores.map(score => score.studentId)).size} students
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Tabs */}
        <Tabs defaultValue="scores">
          <TabsList>
            <TabsTrigger value="scores">Score Details</TabsTrigger>
            <TabsTrigger value="charts">Performance Charts</TabsTrigger>
            <TabsTrigger value="improvement">Improvement Analysis</TabsTrigger>
          </TabsList>
          
          {/* Scores Tab */}
          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle>Test Scores</CardTitle>
                <CardDescription>
                  {selectedStudent 
                    ? `Showing scores for ${mockStudents.find(s => s.id === selectedStudent)?.name}`
                    : 'Showing all student scores'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredScores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScores.map((score) => (
                          <TableRow key={score.id}>
                            <TableCell className="font-medium">{score.studentName}</TableCell>
                            <TableCell>{score.subjectName}</TableCell>
                            <TableCell>{score.testType}</TableCell>
                            <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {formatScoreWithImprovement(score.score, score.previousScore)}
                              <div className="text-xs text-muted-foreground">
                                out of {score.maxScore}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No scores match your filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Charts Tab */}
          <TabsContent value="charts">
            <div className="grid gap-6">
              {selectedStudent ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {mockStudents.find(s => s.id === selectedStudent)?.name}'s Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={studentPerformanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="midterm" name="Midterm Score" fill="#3b82f6" />
                          <Bar dataKey="final" name="Final Score" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Class Average Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={classPerformanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="midtermAverage" name="Midterm Average" fill="#3b82f6" />
                          <Bar dataKey="finalAverage" name="Final Average" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Improvement Analysis Tab */}
          <TabsContent value="improvement">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Analysis</CardTitle>
                <CardDescription>
                  Tracking progress between midterm and final exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {selectedStudent ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Midterm</TableHead>
                            <TableHead>Final</TableHead>
                            <TableHead>Improvement</TableHead>
                            <TableHead>% Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentPerformanceData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{data.subject}</TableCell>
                              <TableCell>{data.midterm}</TableCell>
                              <TableCell>{data.final}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {data.improvement > 0 ? (
                                    <>
                                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                                      <span className="text-green-600">+{data.improvement}</span>
                                    </>
                                  ) : data.improvement < 0 ? (
                                    <span className="text-red-600">{data.improvement}</span>
                                  ) : (
                                    <span className="text-gray-600">0</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={data.improvement >= 0 ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                                  {data.improvementPercent}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Midterm Avg.</TableHead>
                            <TableHead>Final Avg.</TableHead>
                            <TableHead>Avg. Improvement</TableHead>
                            <TableHead>% Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classPerformanceData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{data.subject}</TableCell>
                              <TableCell>{data.midtermAverage}</TableCell>
                              <TableCell>{data.finalAverage}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {data.improvement > 0 ? (
                                    <>
                                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                                      <span className="text-green-600">+{data.improvement.toFixed(1)}</span>
                                    </>
                                  ) : data.improvement < 0 ? (
                                    <span className="text-red-600">{data.improvement.toFixed(1)}</span>
                                  ) : (
                                    <span className="text-gray-600">0</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={data.improvement >= 0 ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                                  {data.improvementPercent}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedStudent ? studentPerformanceData : classPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={selectedStudent ? "midterm" : "midtermAverage"} 
                          name={selectedStudent ? "Midterm" : "Midterm Average"}
                          stroke="#3b82f6" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey={selectedStudent ? "final" : "finalAverage"} 
                          name={selectedStudent ? "Final" : "Final Average"}
                          stroke="#10b981" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TestScores;
