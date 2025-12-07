import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, Printer, Download } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';

interface ReportScreenProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
}

const categoryData = [
  { category: 'Teaching Effectiveness', score: 4.7 },
  { category: 'Classroom Management', score: 4.5 },
  { category: 'Student Engagement', score: 4.8 },
  { category: 'Communication Skills', score: 4.6 },
  { category: 'Assessment Methods', score: 4.4 },
];

const ratingDistribution = [
  { name: '5 Stars', value: 45, color: '#22c55e' },
  { name: '4 Stars', value: 30, color: '#84cc16' },
  { name: '3 Stars', value: 15, color: '#facc15' },
  { name: '2 Stars', value: 7, color: '#fb923c' },
  { name: '1 Star', value: 3, color: '#ef4444' },
];

const summaryTableData = [
  { category: 'Teaching Effectiveness', avg: 4.7, responses: 45, excellent: 32, good: 10, fair: 3 },
  { category: 'Classroom Management', avg: 4.5, responses: 45, excellent: 28, good: 13, fair: 4 },
  { category: 'Student Engagement', avg: 4.8, responses: 45, excellent: 35, good: 8, fair: 2 },
  { category: 'Communication Skills', avg: 4.6, responses: 45, excellent: 30, good: 12, fair: 3 },
  { category: 'Assessment Methods', avg: 4.4, responses: 45, excellent: 26, good: 15, fair: 4 },
];

export function ReportScreen({ onNavigate, onLogout, userName = 'Hnin', userRole }: ReportScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('efrhain');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = () => {
    setIsLoading(true);
    // Simulate API call for PDF generation
    setTimeout(() => {
      setIsLoading(false);
      alert('PDF export initiated! File will be downloaded shortly.');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
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
            title="Evaluation Reports"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-8xl ml-4 space-y-6">
              {/* Filters and Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userRole !== 'teacher' && (
                        <div>
                          <label className="text-gray-700 mb-2 block">Teacher</label>
                          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nadiah">Nadiah</SelectItem>
                              <SelectItem value="zukifli">Zukifli</SelectItem>
                              <SelectItem value="halawati">Halawati</SelectItem>
                              <SelectItem value="mozaherul">Mozaherul</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div>
                        <label className="text-gray-700 mb-2 block">Period</label>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Current Semester</SelectItem>
                            <SelectItem value="previous">Previous Semester</SelectItem>
                            <SelectItem value="year">Academic Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportPDF}
                        className="bg-blue-900 hover:bg-blue-950"
                        disabled={isLoading}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Export as PDF
                      </Button>
                      <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="border-blue-900 text-blue-900 hover:bg-blue-50"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>

                  {/* API Integration Note */}
                  <div className="mt-4 p-3 bg-blue-950/10 border border-blue-900/30 rounded-lg">
                    <p className="text-blue-950 text-xs">
                      <strong>API Integration:</strong> Report data fetched from GET /api/reports?teacher={selectedTeacher}&period={selectedPeriod}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-1">Overall Rating</p>
                    <p className="text-blue-900">4.7/5.0</p>
                    <p className="text-gray-500 text-xs mt-2">Based on 45 responses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-1">Response Rate</p>
                    <p className="text-green-600">84%</p>
                    <p className="text-gray-500 text-xs mt-2">38 out of 45 students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-1">Highest Category</p>
                    <p className="text-blue-900">Student Engagement</p>
                    <p className="text-gray-500 text-xs mt-2">4.8/5.0 average</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-1">Improvement Area</p>
                    <p className="text-orange-600">Assessment Methods</p>
                    <p className="text-gray-500 text-xs mt-2">4.4/5.0 average</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}

                <Card>
                  <CardHeader>
                    <CardTitle>Average Scores by Category</CardTitle>
                    <CardDescription>Performance across different evaluation criteria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} fontSize={12} />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#223368" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                    <CardDescription>Breakdown of student ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ratingDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ratingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Summary Table</CardTitle>
                  <CardDescription>Comprehensive breakdown of scores per category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-gray-600">Category</th>
                          <th className="text-center py-3 px-4 text-gray-600">Avg Score</th>
                          <th className="text-center py-3 px-4 text-gray-600">Responses</th>
                          <th className="text-center py-3 px-4 text-gray-600">Excellent (5)</th>
                          <th className="text-center py-3 px-4 text-gray-600">Good (4)</th>
                          <th className="text-center py-3 px-4 text-gray-600">Fair (3)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summaryTableData.map((row, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{row.category}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-blue-900">{row.avg}</span>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-700">{row.responses}</td>
                            <td className="py-3 px-4 text-center text-green-600">{row.excellent}</td>
                            <td className="py-3 px-4 text-center text-blue-600">{row.good}</td>
                            <td className="py-3 px-4 text-center text-orange-600">{row.fair}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Student Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>Feedback and suggestions from Principal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <p className="text-gray-700 mb-2">
                        "Dr. Rodriguez is an excellent professor who makes complex topics easy to understand. Very approachable and helpful during office hours."
                      </p>
                      <p className="text-gray-500 text-xs">- Madam Fadhilahism </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 mb-2">
                        "Great teaching style and very organized. Would appreciate more real-world examples in lectures."
                      </p>
                      <p className="text-gray-500 text-xs">- Madam Fadhilahism</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 mb-2">
                        "The professor is knowledgeable and passionate about the subject. Clear explanations and fair grading."
                      </p>
                      <p className="text-gray-500 text-xs">- Madam Fadhilahism</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}