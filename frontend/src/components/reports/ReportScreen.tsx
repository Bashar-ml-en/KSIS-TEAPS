import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileDown, Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { reportService, TeacherReport } from '../../services/reportService';
import api from '../../services/api';
import { toast } from 'sonner';

interface ReportScreenProps {
  onNavigate: (view: any) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
}

interface QuickStat {
  label: string;
  value: string | number;
  subtext?: string;
  colorClass: string;
}

export function ReportScreen({ onNavigate, onLogout, userName, userRole }: ReportScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [reportData, setReportData] = useState<TeacherReport | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (selectedTeacherId) {
      loadReport(parseInt(selectedTeacherId), parseInt(selectedYear));
    }
  }, [selectedTeacherId, selectedYear]);

  const initialize = async () => {
    try {
      const profile = await api.get('/user/profile');
      const role = profile.data.role;

      if (role === 'teacher') {
        setIsTeacher(true);
        if (profile.data.teacher_id) {
          setSelectedTeacherId(profile.data.teacher_id.toString());
        } else if (profile.data.teacher?.id) {
          setSelectedTeacherId(profile.data.teacher.id.toString());
        }
      } else {
        // Admin or Principal - load teacher list
        // Try to fetch teachers list
        const teachersRes = await api.get('/teachers');
        // The API might return { data: [...] } or just [...]
        const list = Array.isArray(teachersRes.data) ? teachersRes.data : (teachersRes.data.data || []);
        setTeachers(list);

        // Select first one by default if available
        if (list.length > 0) {
          setSelectedTeacherId(list[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to initialize reports:', error);
      toast.error('Failed to load user profile or teacher list');
    }
  };

  const loadReport = async (id: number, year: number) => {
    setIsLoading(true);
    try {
      const data = await reportService.getTeacherReport(id, year);
      setReportData(data);
    } catch (error) {
      console.error('Failed to load report:', error);
      toast.error('Failed to generate report');
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedTeacherId) return;
    setIsExporting(true);
    try {
      const blob = await reportService.exportReport('individual', parseInt(selectedTeacherId), parseInt(selectedYear));

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Teacher_Report_${selectedTeacherId}_${selectedYear}.csv`); // Backend returns CSV currently
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Prepare Chart Data
  const chartData = reportData && reportData.performance && reportData.performance.breakdown ? [
    { name: 'Part 2 (Teaching)', score: reportData.performance.breakdown.part_2_score, fill: '#4f46e5' },
    { name: 'Part 3 (Dept)', score: reportData.performance.breakdown.part_3_score, fill: '#0ea5e9' },
    { name: 'CPE', score: reportData.performance.breakdown.cpe_score, fill: '#10b981' },
  ] : [];

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
          role={userRole ?? 'teacher'}
          currentView="reports"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Performance Reports"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6 print:p-0 print:overflow-visible">
            <div className="max-w-7xl mx-auto space-y-6">

              {/* Controls - Hide on print */}
              <Card className="print:hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {!isTeacher && (
                        <div>
                          <label className="text-gray-700 mb-2 block font-medium text-sm">Select Teacher</label>
                          <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher..." />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.map((t) => (
                                <SelectItem key={t.id} value={t.id.toString()}>
                                  {t.full_name || t.name} ({t.employee_id || 'N/A'})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <label className="text-gray-700 mb-2 block font-medium text-sm">Academic Year</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportPDF}
                        className="bg-blue-900 hover:bg-blue-950"
                        disabled={isExporting || !reportData}
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                        Export CSV
                      </Button>
                      <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="border-blue-900 text-blue-900 hover:bg-blue-50"
                        disabled={!reportData}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-500">Loading report data...</p>
                </div>
              ) : !reportData ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No report data found for the selected teacher and year.</p>
                </div>
              ) : (
                <>
                  {/* Report Header */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm print:shadow-none print:border-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{reportData.teacher.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <p><span className="font-semibold">ID:</span> {reportData.teacher.employee_id}</p>
                      <p><span className="font-semibold">Department:</span> {reportData.teacher.department}</p>
                      <p><span className="font-semibold">Position:</span> {reportData.teacher.position}</p>
                      <p><span className="font-semibold">Year:</span> {reportData.year}</p>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-1 text-sm font-medium">Final Score</p>
                        <p className="text-3xl font-bold text-blue-900">{reportData.performance?.final_score ?? 'N/A'}</p>
                        <p className="text-gray-500 text-xs mt-2">Weighted Score</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-1 text-sm font-medium">Performance Rating</p>
                        <p className={`text-2xl font-bold ${reportData.performance?.rating === 'Excellent' ? 'text-green-600' :
                            reportData.performance?.rating === 'Good' ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                          {reportData.performance?.rating ?? 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">Overall Assessment</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-1 text-sm font-medium">CPE Points</p>
                        <p className="text-3xl font-bold text-indigo-900">{reportData.cpe_summary.total_points}</p>
                        <p className="text-gray-500 text-xs mt-2">Accumulated Points</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-1 text-sm font-medium">Compliance Status</p>
                        <p className={`text-xl font-bold ${reportData.cpe_summary.compliant ? 'text-green-600' : 'text-red-500'}`}>
                          {reportData.cpe_summary.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">{reportData.cpe_summary.total_hours} Hours Recorded</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts and Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
                    {/* Bar Chart */}
                    <Card className="print:break-inside-avoid">
                      <CardHeader>
                        <CardTitle>Performance Breakdown</CardTitle>
                        <CardDescription>Weighed scores by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {reportData.performance?.breakdown ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[300px] flex items-center justify-center text-gray-500">
                            No breakdown data available
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Detailed Data Table */}
                    <Card className="print:break-inside-avoid">
                      <CardHeader>
                        <CardTitle>Detailed Scores</CardTitle>
                        <CardDescription>Component details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Component</th>
                              <th className="text-right py-2">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3">Part 2: Teaching Processes</td>
                              <td className="text-right font-medium">{reportData.performance?.breakdown.part_2_score ?? '-'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3">Part 3: Department Contribution</td>
                              <td className="text-right font-medium">{reportData.performance?.breakdown.part_3_score ?? '-'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3">CPE (Bonus/Penalty)</td>
                              <td className="text-right font-medium">{reportData.performance?.breakdown.cpe_score ?? '-'}</td>
                            </tr>
                            <tr className="bg-gray-50 font-bold">
                              <td className="py-3 pl-2">Final Weighted Score</td>
                              <td className="text-right pr-2">{reportData.performance?.final_score ?? '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}