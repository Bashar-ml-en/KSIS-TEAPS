import React, { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Search, Mail, Phone, MapPin, BookOpen, Award, ArrowLeft, Plus } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';

interface Teacher {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  qualification: string;
  experience: number;
  kpi: number;
  students: number;
  rating: number;
}

interface TeacherListProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
}

const teachers: Teacher[] = [
  { id: 1, name: 'Dr. Mozaherul Islam', department: 'Science', email: 'mozaherul@school.edu', phone: '+60-123-456789', office: 'S101', qualification: 'PhD Computer Science', experience: 12, kpi: 95.8, students: 120, rating: 4.8 },
  { id: 2, name: 'Mdm Nadiah Arsat', department: 'Mathematics', email: 'nadiah@school.edu', phone: '+60-123-456790', office: 'M102', qualification: 'Master of Education', experience: 10, kpi: 94.5, students: 100, rating: 4.7 },
  { id: 3, name: 'Mr Zukifli Ahmad', department: 'IT', email: 'zukifli@school.edu', phone: '+60-123-456791', office: 'IT103', qualification: 'Bachelor of IT', experience: 8, kpi: 93.2, students: 110, rating: 4.6 },
  { id: 4, name: 'Dr. Umi Safiah', department: 'Machine Learning', email: 'umi@school.edu', phone: '+60-123-456792', office: 'ML104', qualification: 'PhD Machine Learning', experience: 9, kpi: 92.7, students: 95, rating: 4.5 },
  { id: 5, name: 'Mdm Halawati Hassan', department: 'Software Engineering', email: 'halawati@school.edu', phone: '+60-123-456793', office: 'SE105', qualification: 'Master of SE', experience: 11, kpi: 91.5, students: 105, rating: 4.4 },
  { id: 6, name: 'Mr Faizal Rahman', department: 'Science', email: 'faizal@school.edu', phone: '+60-123-456794', office: 'S106', qualification: 'Bachelor of Science', experience: 7, kpi: 90.2, students: 115, rating: 4.3 },
  { id: 7, name: 'Mdm Siti Nurhaliza', department: 'Mathematics', email: 'siti@school.edu', phone: '+60-123-456795', office: 'M107', qualification: 'Master of Education', experience: 6, kpi: 89.8, students: 108, rating: 4.2 },
  { id: 8, name: 'Mr Hamid Hassan', department: 'IT', email: 'hamid@school.edu', phone: '+60-123-456796', office: 'IT108', qualification: 'Bachelor of IT', experience: 5, kpi: 88.5, students: 102, rating: 4.1 },
];

export function TeacherList({ onNavigate, onLogout, userName, userRole = 'principal' }: TeacherListProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isAddTeacherClicked, setIsAddTeacherClicked] = useState(false);

  const handleAddTeacherClick = () => {
    setIsAddTeacherClicked(true);
    onNavigate('add-teacher');
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedTeacher) {
    return (
      <div className="flex h-screen overflow-hidden relative">
        <Sidebar
          role={userRole}
          currentView="teacher-list"
          onNavigate={(view: string) => onNavigate(view as View)}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={`Teacher Details - ${selectedTeacher.name}`}
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Button
              onClick={() => setSelectedTeacher(null)}
              className="mb-6 bg-slate-700 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teachers
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Card */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">{selectedTeacher.name}</CardTitle>
                    <CardDescription className="text-slate-200">{selectedTeacher.department} Department</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-slate-600" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-gray-900">{selectedTeacher.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-slate-600" />
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-gray-900">{selectedTeacher.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-slate-600" />
                            <div>
                              <p className="text-xs text-gray-500">Office</p>
                              <p className="text-gray-900">{selectedTeacher.office}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-slate-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500">Qualification</p>
                              <p className="text-gray-900">{selectedTeacher.qualification}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-slate-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500">Teaching Experience</p>
                              <p className="text-gray-900">{selectedTeacher.experience} years</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600 mb-1">Total Students</p>
                            <p className="text-2xl font-bold text-blue-900">{selectedTeacher.students}</p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-600 mb-1">Average Rating</p>
                            <p className="text-2xl font-bold text-yellow-900">{selectedTeacher.rating.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* KPI Card */}
              <div>
                <Card className="shadow-lg sticky top-6">
                  <CardHeader className="bg-gradient-to-b from-slate-700 to-slate-800 text-white rounded-t-lg">
                    <CardTitle>Performance Score</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 mb-2">KPI Score</p>
                      <p className="text-5xl font-bold text-slate-900">{selectedTeacher.kpi.toFixed(1)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-slate-700 to-slate-800 h-3 rounded-full"
                        style={{ width: `${selectedTeacher.kpi}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-sm font-semibold ${
                          selectedTeacher.kpi >= 90
                            ? 'text-green-600'
                            : selectedTeacher.kpi >= 80
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {selectedTeacher.kpi >= 90
                          ? '⭐ Excellent'
                          : selectedTeacher.kpi >= 80
                          ? '✓ Good'
                          : '→ Satisfactory'}
                      </p>
                    </div>
                    <Button
                      onClick={() => onNavigate('reports')}
                      className="w-full mt-6 bg-slate-700 hover:bg-slate-800"
                    >
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        role={userRole}
        currentView="teacher-list"
        onNavigate={(view: string) => onNavigate(view as View)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Teachers Management" userName={userName} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Search Bar */}
          <Card className="mb-6 shadow-md bg-white rounded-lg">
            <CardContent className="p-4 flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by teacher name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
               <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const btn = e.currentTarget;
                  btn.classList.add('bg-[#223368]');
                  btn.classList.remove('bg-blue-700', 'hover:bg-blue-800');
                  onNavigate('add-teacher');
                }}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="bg-white border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-lg font-bold text-gray-800">{teacher.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">{teacher.department}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {teacher.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Experience:</strong> {teacher.experience} years
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Students:</strong> {teacher.students}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>KPI Score:</strong>{' '}
                      <span className="text-blue-700 font-bold">{teacher.kpi}%</span>
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => setSelectedTeacher(teacher)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}