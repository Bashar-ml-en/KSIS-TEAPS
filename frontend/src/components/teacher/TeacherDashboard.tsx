import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, TrendingUp, Users, Star } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import { teacherService, DashboardStats, Submission } from '../../services/teacherService';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface TeacherDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

export function TeacherDashboard({ onNavigate, onLogout, userName: propUserName }: TeacherDashboardProps) {
  const { user, refreshUser } = useAuth();
  const userName = user?.name || propUserName || 'Teacher';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total_evaluations: 0,
    average_score: 0,
    total_students: 0,
    response_rate: 0
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, submissionsData] = await Promise.all([
        teacherService.getDashboardStats(),
        teacherService.getRecentSubmissions()
      ]);
      setStats(statsData);
      setSubmissions(submissionsData);
    } catch (error) {
      //   console.error("Failed to load teacher dashboard data", error);
      // Suppress error for now as backend might be empty
    }
  };

  const handleProfileImageChange = async (file: File) => {
    try {
      await authService.updateProfilePhoto(file);
      await refreshUser();
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile photo");
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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role="teacher"
          currentView="teacher"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Teacher Dashboard"
            userName={userName}
            userRole="teacher"
            userProfileImage={user?.profile_photo_url}
            onProfileImageChange={handleProfileImageChange}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Evaluations Received</p>
                      <p className="text-blue-700">{stats.total_evaluations}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Average Score</p>
                      <p className="text-green-600">{stats.average_score}/5.0</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Total Students</p>
                      <p className="text-blue-700">{stats.total_students}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Response Rate</p>
                      <p className="text-orange-600">{stats.response_rate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('attendance')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Attendance</h3>
                      <p className="text-gray-600">Time in/out & leave requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('reports')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">View Reports</h3>
                      <p className="text-gray-600">Evaluation reports & analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('re-evaluation')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Re-evaluation</h3>
                      <p className="text-gray-600">Request review of your KPI</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('kpi-info')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">KPI Info</h3>
                      <p className="text-gray-600">Learn about KPI metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>Latest evaluation submissions </CardDescription>
                  </div>
                  <Button
                    onClick={() => onNavigate('reports')}
                    variant="outline"
                    className="border-blue-700 text-blue-700 hover:bg-blue-50"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600">Teacher</th>
                        <th className="text-left py-3 px-4 text-gray-600">Subject</th>
                        <th className="text-left py-3 px-4 text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-gray-600">Rating</th>
                        <th className="text-left py-3 px-4 text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{submission.teacher}</td>
                          <td className="py-3 px-4 text-gray-700">{submission.subject}</td>
                          <td className="py-3 px-4 text-gray-700">{submission.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-blue-700">{submission.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {submissions.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4 text-gray-500">No submissions found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}