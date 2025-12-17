import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, TrendingUp, FileText, Award, Clock, Loader2, RefreshCw } from 'lucide-react';
import { View } from '../../App';
import { principalService, DashboardStats } from '../../services/principalService';
import { toast } from 'sonner';

interface PrincipalDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

export function PrincipalDashboard({ onNavigate, onLogout, userName = 'Principal' }: PrincipalDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const stats = await principalService.getDashboardStats();
      setData(stats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role="principal"
          currentView="principal"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Principal Dashboard"
            userName={userName}
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
                            <p className="text-gray-600 mb-1 font-medium">Total Teachers</p>
                            <p className="text-blue-900 font-bold text-3xl">{data?.stats.total_teachers ?? 0}</p>
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
                            <p className="text-gray-600 mb-1 font-medium">Average KPI</p>
                            <p className="text-green-600 font-bold text-3xl">{data?.stats.average_kpi ?? 0}%</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
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
                            <p className="text-gray-600 mb-1 font-medium">Pending Evals</p>
                            <p className="text-blue-600 font-bold text-3xl">{data?.stats.pending_evaluations ?? 0}</p>
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
                            <p className="text-gray-600 mb-1 font-medium">Pending Re-evals</p>
                            <p className="text-orange-600 font-bold text-3xl">{data?.stats.pending_reevaluations ?? 0}</p>
                          </div>
                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { title: 'KPI Info', desc: 'View guidelines', icon: Award, color: 'blue', action: 'kpi-info' },
                    { title: 'Calculation', desc: 'View methodology', icon: TrendingUp, color: 'green', action: 'kpi-calculation' },
                    { title: 'Reports', desc: 'View all reports', icon: FileText, color: 'purple', action: 'reports' },
                    { title: 'Evaluations', desc: 'Manage evaluations', icon: Users, color: 'orange', action: 'teacher-evaluation' }
                  ].map((item, index) => (
                    <div key={index}>
                      <Card
                        className={`hover:shadow-lg cursor-pointer border-l-4 border-l-${item.color}-500 transition-all`}
                        onClick={() => onNavigate(item.action as View)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center`}>
                              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Performers */}
                  <div>
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-800">Top Performing Teachers</CardTitle>
                        <CardDescription>Highest KPI scores this year</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {data?.top_performers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">No data available</p>
                          ) : (
                            data?.top_performers.map((teacher, i) => (
                              <div
                                key={teacher.id}
                                className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                    {i + 1}
                                  </div>
                                  <div>
                                    <h4 className="text-gray-900 font-bold">{teacher.full_name}</h4>
                                    <p className="text-gray-500 text-xs font-medium">{teacher.department?.name || 'No Department'}</p>
                                  </div>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                                  {teacher.final_weighted_score}%
                                </div>
                              </div>
                            )))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Re-evaluation Requests */}
                  <div>
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-800">Recent Re-evaluation Requests</CardTitle>
                        <CardDescription>Latest requests requiring review</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {data?.recent_reevaluations.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">No pending requests</p>
                          ) : (
                            data?.recent_reevaluations.map((request, i) => (
                              <div
                                key={request.id}
                                className="p-4 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-gray-900 font-bold">{request.teacher.full_name}</h4>
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${getStatusColor(request.status)}`}>
                                    {request.status}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{request.reason}</p>
                                <div className="flex items-center text-gray-400 text-xs gap-1.5 font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  {new Date(request.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            )))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}