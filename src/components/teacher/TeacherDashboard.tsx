import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, TrendingUp, Users, Star } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';

interface TeacherDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

const recentSubmissions = [
  {
    id: 1,
    teacher: 'Nadiah Arsat',
    subject: 'IT 307 - Web Systems and Technologies 2',
    date: '2025-11-14',
    rating: 4.5,
  },
  {
    id: 2,
    teacher: 'Halawati Binti Mohd Noor',
    subject: 'IT 307 - Web Systems and Technologies 2',
    date: '2025-11-13',
    rating: 5.0,
  },
  {
    id: 3,
    teacher: 'Mozaherul',
    subject: 'IT 303 - Event-Driven Programming',
    date: '2025-11-13',
    rating: 4.8,
  },
  {
    id: 4,
    teacher: 'Zukifli Bin Zakaria',
    subject: 'IT 307 - Web Systems and Technologies 2',
    date: '2025-11-12',
    rating: 4.7,
  },
  
];

export function TeacherDashboard({ onNavigate, onLogout, userName = 'Nadiah Arsat' }: TeacherDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalEvaluations = 45;
  const averageScore = 4.7;
  const totalStudents = 38;

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
                      <p className="text-blue-700">{totalEvaluations}</p>
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
                      <p className="text-green-600">{averageScore}/5.0</p>
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
                      <p className="text-blue-700">{totalStudents}</p>
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
                      <p className="text-orange-600">84%</p>
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
                      {recentSubmissions.map((submission) => (
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