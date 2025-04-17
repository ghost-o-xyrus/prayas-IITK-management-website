
import { useState } from 'react';
import { Calendar, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, addDays, subDays } from 'date-fns';
import MainLayout from '@/components/MainLayout';

// Mock student data
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

// Mock attendance data
const generateMockAttendance = (date: Date) => {
  return mockStudents.map(student => ({
    studentId: student.id,
    date: format(date, 'yyyy-MM-dd'),
    status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
  }));
};

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState(generateMockAttendance(currentDate));

  const handlePreviousDay = () => {
    const newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
    setAttendance(generateMockAttendance(newDate));
  };

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1);
    setCurrentDate(newDate);
    setAttendance(generateMockAttendance(newDate));
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => 
      prev.map(item => 
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId)?.status || 'absent';
  };

  const getStatusElement = (status: string) => {
    switch (status) {
      case 'present':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <X className="h-5 w-5 text-red-500" />;
      case 'late':
        return <span className="text-amber-500 text-sm font-medium">Late</span>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance</h1>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{format(currentDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Class 10A Attendance</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((student) => {
                  const status = getAttendanceStatus(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusElement(status)}
                          <span className="ml-2 capitalize">{status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant={status === 'present' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                            onClick={() => handleAttendanceChange(student.id, 'present')}
                          >
                            Present
                          </Button>
                          <Button
                            variant={status === 'absent' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                            onClick={() => handleAttendanceChange(student.id, 'absent')}
                          >
                            Absent
                          </Button>
                          <Button
                            variant={status === 'late' ? 'default' : 'outline'}
                            size="sm"
                            className={status === 'late' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                            onClick={() => handleAttendanceChange(student.id, 'late')}
                          >
                            Late
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center justify-end gap-4">
              <div className="text-sm text-muted-foreground">
                Present: {attendance.filter(a => a.status === 'present').length}/{mockStudents.length}
              </div>
              <Button>Save Attendance</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;
