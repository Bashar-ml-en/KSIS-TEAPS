import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, TrendingUp, FileText, Award, CheckCircle, Clock } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

interface PrincipalDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

// Dummy data removed - in future, fetch real top performers from API

export function PrincipalDashboard({ onNavigate, onLogout, userName = 'Principal' }: PrincipalDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reevaluationRequests, setReevaluationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReevaluationRequests();
  }, []);

  const loadReevaluationRequests = async () => {
    try {
      const response = await api.get('/reevaluation-requests?status=pending');
      console.log('Re-evaluation requests:', response.data);
      const requests = response.data.data || response.data;
      // Map to expected format
      const mappedRequests = requests.map((req: any) => ({
        id: req.id,
        teacher: req.teacher?.user?.name || 'Unknown Teacher',
        reason: req.reason,
        status: req.status === 'pending' ? 'Pending' : req.status === 'approved' ? 'Approved' : 'Under Review',
        date: new Date(req.created_at).toISOString().split('T')[0]
      }));
      setReevaluationRequests(mappedRequests);
    } catch (error) {
      console.error('Failed to load re-evaluation requests:', error);
      toast.error('Failed to load re-evaluation requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Fallback gradient
      }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />

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

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Total Teachers</p>
                      <p className="text-blue-700">42</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Average KPI</p>
                      <p className="text-green-600">87.5%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Evaluations</p>
                      <p className="text-blue-600">1,245</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Re-evaluations</p>
                      <p className="text-orange-600">8 Pending</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('kpi-info')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">KPI Information</h3>
                      <p className="text-gray-600">Learn how KPIs are generated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('kpi-calculation')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">KPI Calculation</h3>
                      <p className="text-gray-600">View KPI calculation methodology</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('reports')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">View Reports</h3>
                      <p className="text-gray-600">Access all performance reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('teacher-evaluation')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Evaluate Teachers</h3>
                      <p className="text-gray-600">Perform teacher evaluations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Teachers</CardTitle>
                  <CardDescription>Highest KPI scores this semester</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="text-gray-900">{teacher.name}</h4>
                          <p className="text-gray-600 text-xs">{teacher.department}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-blue-700">KPI: {teacher.kpi}%</p>
                            <p className={`text-xs ${teacher.trend === 'up' ? 'text-green-600' :
                              teacher.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                              {teacher.trend === 'up' ? '↑' : teacher.trend === 'down' ? '↓' : '→'}
                              {teacher.trend === 'up' ? ' Improving' : teacher.trend === 'down' ? ' Declining' : ' Stable'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Re-evaluation Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Re-evaluation Requests</CardTitle>
                  <CardDescription>Recent teacher re-evaluation requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}