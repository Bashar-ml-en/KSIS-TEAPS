import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';

interface AttendanceSystemProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole: 'teacher' | 'admin' | 'principal';
}

const todayDate = new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

const currentTime = new Date().toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true 
});

const attendanceHistory = [
  { date: '2025-11-15', timeIn: '08:15 AM', timeOut: '04:30 PM', status: 'Present', hours: 8.25 },
  { date: '2025-11-14', timeIn: '08:10 AM', timeOut: '04:25 PM', status: 'Present', hours: 8.25 },
  { date: '2025-11-13', timeIn: '08:20 AM', timeOut: '04:35 PM', status: 'Present', hours: 8.25 },
  { date: '2025-11-12', timeIn: '08:05 AM', timeOut: '04:20 PM', status: 'Present', hours: 8.25 },
  { date: '2025-11-11', timeIn: '-', timeOut: '-', status: 'On Leave', hours: 0 },
  { date: '2025-11-08', timeIn: '08:25 AM', timeOut: '04:40 PM', status: 'Present', hours: 8.25 },
  { date: '2025-11-07', timeIn: '08:12 AM', timeOut: '04:28 PM', status: 'Present', hours: 8.27 },
];

const leaveRequests = [
  { id: 1, type: 'Sick Leave', startDate: '2025-11-20', endDate: '2025-11-21', status: 'Pending', reason: 'Medical appointment' },
  { id: 2, type: 'Personal Leave', startDate: '2025-11-11', endDate: '2025-11-11', status: 'Approved', reason: 'Family matter' },
  { id: 3, type: 'Professional Development', startDate: '2025-10-25', endDate: '2025-10-26', status: 'Approved', reason: 'Training seminar' },
];

export function AttendanceSystem({ onNavigate, onLogout, userName, userRole }: AttendanceSystemProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [timeInRecord, setTimeInRecord] = useState('');

  const handleTimeIn = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setTimeInRecord(now);
    setIsTimedIn(true);
  };

  const handleTimeOut = () => {
    setIsTimedIn(false);
  };

  const attendanceRate = 95.5;
  const totalDays = 22;
  const presentDays = 21;
  const leaveDays = 1;

  return (
    <div 
      className="flex h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
      
      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role={userRole}
          currentView="attendance"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Attendance & Leave System"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

       <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Current Date/Time and Time In/Out */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>{todayDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <Clock className="w-12 h-12 text-blue-700 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Current Time</p>
                      <p className="text-blue-700">{currentTime}</p>
                    </div>
                    
                    {!isTimedIn ? (
                      <Button 
                        onClick={handleTimeIn}
                        className="w-full bg-green-600 hover:bg-green-700 h-14"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Time In
                      </Button>
                    ) : (
                      <>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-800 mb-1">Time In</p>
                              <p className="text-green-600">{timeInRecord}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <Button 
                          onClick={handleTimeOut}
                          className="w-full bg-red-600 hover:bg-red-700 h-14"
                        >
                          <LogOutIcon className="w-5 h-5 mr-2" />
                          Time Out
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                  <CardDescription>November 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span>Attendance Rate</span>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="mb-1">{attendanceRate}%</p>
                      <div className="w-full bg-blue-700 rounded-full h-2">
                        <div 
                          className="bg-white rounded-full h-2" 
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 text-xs mb-1">Total Days</p>
                        <p className="text-gray-900">{totalDays}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-600 text-xs mb-1">Present</p>
                        <p className="text-green-700">{presentDays}</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-orange-600 text-xs mb-1">On Leave</p>
                        <p className="text-orange-700">{leaveDays}</p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Request Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance History */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-gray-600">Time In</th>
                        <th className="text-left py-3 px-4 text-gray-600">Time Out</th>
                        <th className="text-left py-3 px-4 text-gray-600">Hours</th>
                        <th className="text-left py-3 px-4 text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((record, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{record.date}</td>
                          <td className="py-3 px-4 text-gray-700">{record.timeIn}</td>
                          <td className="py-3 px-4 text-gray-700">{record.timeOut}</td>
                          <td className="py-3 px-4 text-gray-700">{record.hours}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="secondary"
                              className={
                                record.status === 'Present' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-orange-100 text-orange-700'
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Your leave application history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-gray-900">{leave.type}</h4>
                            <Badge 
                              variant="secondary"
                              className={
                                leave.status === 'Approved' 
                                  ? 'bg-green-100 text-green-700' 
                                  : leave.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }
                            >
                              {leave.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-xs mb-2">
                            {leave.startDate} {leave.startDate !== leave.endDate && `to ${leave.endDate}`}
                          </p>
                          <p className="text-gray-700 text-xs">{leave.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
