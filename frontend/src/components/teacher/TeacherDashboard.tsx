import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, TrendingUp, Users, Star, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total_evaluations: 0,
    average_score: 0,
    pending_kpi_requests: 0,
    kpi_approval_rate: 0,
    attendance_rate: 100,
    total_kpi_requests: 0
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, submissionsData] = await Promise.all([
        teacherService.getDashboardStats(),
        teacherService.getRecentSubmissions()
      ]);
      setStats(statsData);
      setSubmissions(submissionsData);
    } catch (error) {
      // Suppress error for now as backend might be empty
    } finally {
      setIsLoading(false);
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
    <div className="flex h-screen overflow-hidden relative">
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

          <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading dashboard...</p>
              </div>
            ) : (
              <div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 mb-1 font-medium">Evaluations Received</p>
                            <p className="text-blue-900 font-bold text-3xl">{stats.total_evaluations}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 mb-1 font-medium">Average Score</p>
                            <p className="text-green-600 font-bold text-3xl">{stats.average_score}/5.0</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 mb-1 font-medium">Pending KPIs</p>
                            <p className="text-blue-600 font-bold text-3xl">{stats.pending_kpi_requests}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 mb-1 font-medium">Attendance Rate</p>
                            <p className="text-orange-600 font-bold text-3xl">{stats.attendance_rate}%</p>
                          </div>
                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { title: 'Attendance', desc: 'Time in/out & leave requests', icon: TrendingUp, color: 'blue', action: 'attendance' },
                    { title: 'View Reports', desc: 'Evaluation reports & analytics', icon: FileText, color: 'blue', action: 'reports' },
                    { title: 'Re-evaluation', desc: 'Request review of your KPI', icon: Star, color: 'orange', action: 're-evaluation' },
                    { title: 'KPI Info', desc: 'Learn about KPI metrics', icon: TrendingUp, color: 'green', action: 'kpi-info' }
                  ].map((item, index) => (
                    <div key={index}>
                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => onNavigate(item.action as View)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center`}>
                              <item.icon className={index === 1 ? 'w-6 h-6 text-black' : `w-6 h-6 text-${item.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-gray-900 font-bold text-lg mb-0.5">{item.title}</h3>
                              <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Recent Submissions */}
                <div>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">Recent Submissions</CardTitle>
                          <CardDescription>Latest evaluation submissions</CardDescription>
                        </div>
                        <Button
                          onClick={() => onNavigate('reports')}
                          variant="outline"
                          className="border-blue-700 text-blue-700 hover:bg-blue-50 font-medium"
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
                              <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Teacher</th>
                              <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Subject</th>
                              <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Date</th>
                              <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Rating</th>
                              <th className="text-left py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((submission, i) => (
                              <tr
                                key={submission.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-4 px-4 text-gray-900 font-medium">{submission.teacher}</td>
                                <td className="py-4 px-4 text-gray-700">{submission.subject}</td>
                                <td className="py-4 px-4 text-gray-700">{submission.date}</td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-1 bg-yellow-50 w-fit px-2 py-1 rounded-md border border-yellow-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-yellow-700 font-bold">{submission.rating}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-medium">
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {submissions.length === 0 && (
                              <tr><td colSpan={5} className="text-center py-8 text-gray-500 italic">No submissions found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}