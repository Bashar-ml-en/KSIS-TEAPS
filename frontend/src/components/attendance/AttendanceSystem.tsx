import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, LogIn, LogOut as LogOutIcon, Loader2, Users } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import { attendanceService, Attendance, LeaveRequest, AttendanceMetrics } from '../../services/attendanceService';
import { toast } from 'sonner';

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

export function AttendanceSystem({ onNavigate, onLogout, userName, userRole }: AttendanceSystemProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));

  // Teacher State
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [timeInRecord, setTimeInRecord] = useState('');
  const [metrics, setMetrics] = useState<AttendanceMetrics>({
    attendance_rate: 0,
    total_days: 0,
    present_days: 0,
    late_days: 0,
    leave_days: 0
  });

  // Shared State
  const [history, setHistory] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Leave Request Modal State (Teacher)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: 'Sick Leave',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const isAdmin = userRole === 'admin' || userRole === 'principal';

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);

    loadData();

    return () => clearInterval(timer);
  }, [userRole]);

  const loadData = async () => {
    try {
      if (isAdmin) {
        // Admin Load: All history and all leave requests
        const [historyData, leavesData] = await Promise.all([
          attendanceService.getHistory(50), // Fetch more for admin
          attendanceService.getLeaveRequests()
        ]);
        setHistory(historyData);
        setLeaves(leavesData);
      } else {
        // Teacher Load
        const [statusData, historyData, leavesData, metricsData] = await Promise.all([
          attendanceService.getTodayStatus(),
          attendanceService.getHistory(),
          attendanceService.getLeaveRequests(),
          attendanceService.getMetrics()
        ]);

        setIsTimedIn(statusData.timed_in);
        if (statusData.time_in) {
          setTimeInRecord(new Date(`2000-01-01T${statusData.time_in}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        }

        setHistory(historyData);
        setLeaves(leavesData);
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error("Failed to load attendance data", error);
      toast.error("Failed to load attendance data");
    }
  };

  const handleTimeIn = async () => {
    try {
      const result = await attendanceService.clockIn();
      setIsTimedIn(true);
      setTimeInRecord(new Date(`2000-01-01T${result.time_in}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      toast.success("Clocked in successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to clock in");
    }
  };

  const handleTimeOut = async () => {
    try {
      await attendanceService.clockOut();
      setIsTimedIn(false);
      toast.success("Clocked out successfully");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to clock out");
    }
  };

  const handleLeaveSubmit = async () => {
    if (!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmittingLeave(true);
    try {
      await attendanceService.requestLeave(leaveForm);
      toast.success("Leave request submitted successfully");
      setIsLeaveModalOpen(false);
      setLeaveForm({
        leave_type: 'Sick Leave',
        start_date: '',
        end_date: '',
        reason: ''
      });
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const handleApproveLeave = async (id: number) => {
    try {
      await attendanceService.updateLeaveStatus(id, 'approved');
      toast.success("Leave request approved");
      loadData();
    } catch (error) {
      toast.error("Failed to approve leave");
    }
  };

  const handleRejectLeave = async (id: number) => {
    // For now, simple reject without reason prompt for speed, can add prompt later
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
      await attendanceService.updateLeaveStatus(id, 'rejected', 'Rejected by Admin');
      toast.success("Leave request rejected");
      loadData();
    } catch (error) {
      toast.error("Failed to reject leave");
    }
  };

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
            title={isAdmin ? "Staff Attendance Monitoring" : "Attendance & Leave System"}
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {!isAdmin ? (
              // TEACHER VIEW
              <>
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
                          <p className="text-blue-700 font-bold text-xl">{currentTime}</p>
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
                                  <p className="text-green-600 font-bold">{timeInRecord}</p>
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
                      <CardDescription>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span>Attendance Rate</span>
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <p className="mb-1 text-2xl font-bold">{metrics.attendance_rate}%</p>
                          <div className="w-full bg-blue-800/50 rounded-full h-2">
                            <div
                              className="bg-white rounded-full h-2 transition-all duration-500"
                              style={{ width: `${metrics.attendance_rate}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <p className="text-gray-600 text-xs mb-1">Total Days</p>
                            <p className="text-gray-900 font-bold">{metrics.total_days}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                            <p className="text-green-600 text-xs mb-1">Present</p>
                            <p className="text-green-700 font-bold">{metrics.present_days}</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                            <p className="text-orange-600 text-xs mb-1">On Leave</p>
                            <p className="text-orange-700 font-bold">{metrics.leave_days}</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                          onClick={() => setIsLeaveModalOpen(true)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Request Leave
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              // ADMIN VIEW - Dashboard cards
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-600 font-medium">Present Today</p>
                        <h3 className="text-3xl font-bold text-blue-900 mt-2">
                          {history.filter(h => h.date === new Date().toISOString().split('T')[0] && h.status !== 'absent').length}
                        </h3>
                      </div>
                      <Users className="w-10 h-10 text-blue-300" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-orange-600 font-medium">Late Arrivals</p>
                        <h3 className="text-3xl font-bold text-orange-900 mt-2">
                          {history.filter(h => h.date === new Date().toISOString().split('T')[0] && h.status === 'late').length}
                        </h3>
                      </div>
                      <Clock className="w-10 h-10 text-orange-300" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-purple-600 font-medium">Pending Leaves</p>
                        <h3 className="text-3xl font-bold text-purple-900 mt-2">
                          {leaves.filter(l => l.status === 'pending').length}
                        </h3>
                      </div>
                      <Calendar className="w-10 h-10 text-purple-300" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Attendance History (Shared structure but different columns if needed) */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{isAdmin ? "Recent Logs" : "Attendance History"}</CardTitle>
                <CardDescription>Recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {isAdmin && <th className="text-left py-3 px-4 text-gray-600">Staff Name</th>}
                        <th className="text-left py-3 px-4 text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-gray-600">Time In</th>
                        <th className="text-left py-3 px-4 text-gray-600">Time Out</th>
                        <th className="text-left py-3 px-4 text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          {isAdmin && <td className="py-3 px-4 font-medium text-gray-900">{record.user?.name || 'Unknown'}</td>}
                          <td className="py-3 px-4 text-gray-900">{record.date}</td>
                          <td className="py-3 px-4 text-gray-700">{record.time_in || '-'}</td>
                          <td className="py-3 px-4 text-gray-700">{record.time_out || '-'}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="secondary"
                              className={
                                record.status === 'present'
                                  ? 'bg-green-100 text-green-700'
                                  : record.status === 'late'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr><td colSpan={isAdmin ? 5 : 4} className="text-center py-4 text-gray-500">No records found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle>{isAdmin ? "Leave Management" : "My Leave Requests"}</CardTitle>
                <CardDescription>{isAdmin ? "Manage staff leave applications" : "Your leave application history"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-gray-900 font-medium">
                              {isAdmin ? (leave.user?.name || 'Staff Member') : leave.leave_type}
                            </h4>
                            {isAdmin && <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{leave.leave_type}</span>}
                            <Badge
                              variant="secondary"
                              className={
                                leave.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : leave.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }
                            >
                              {leave.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-xs mb-2">
                            <span className="font-semibold">Duration:</span> {leave.start_date} {leave.start_date !== leave.end_date && `to ${leave.end_date}`}
                          </p>
                          <p className="text-gray-700 text-sm bg-white p-2 rounded border border-gray-100 italic">"{leave.reason}"</p>
                        </div>

                        {isAdmin && leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApproveLeave(leave.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8" onClick={() => handleRejectLeave(leave.id)}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {leaves.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No leave requests found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a leave request for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="leave_type">Leave Type</Label>
              <Select
                value={leaveForm.leave_type}
                onValueChange={(val: string) => setLeaveForm({ ...leaveForm, leave_type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  <SelectItem value="Study Leave">Study Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleLeaveSubmit} disabled={isSubmittingLeave}>
              {isSubmittingLeave ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
