import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Award, BookOpen, FileText, Calendar, Download, Plus, Search } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';

interface TrainingCertificate {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  status: 'Active' | 'Expired' | 'Expiring Soon';
}

interface ProfessionalDevelopment {
  id: number;
  activity: string;
  type: 'Workshop' | 'Seminar' | 'Course' | 'Conference';
  date: string;
  duration: string;
  organizer: string;
  description: string;
  hoursEarned: number;
}

interface HRDocument {
  id: number;
  title: string;
  type: 'Contract' | 'Policy' | 'Evaluation' | 'Promotion' | 'Other';
  uploadDate: string;
  fileSize: string;
  fileName: string;
}

interface HRRecordsProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
}

const trainingCertificates: TrainingCertificate[] = [
  {
    id: 1,
    title: 'Advanced Teaching Methodologies',
    issuer: 'Ministry of Education',
    issueDate: '2024-06-15',
    expiryDate: '2027-06-15',
    certificateNumber: 'MOE-2024-001234',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Digital Literacy Certification',
    issuer: 'UNESCO',
    issueDate: '2023-09-20',
    expiryDate: '2026-09-20',
    certificateNumber: 'UNESCO-2023-5678',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Leadership in Education',
    issuer: 'Oxford University',
    issueDate: '2022-12-10',
    expiryDate: '2025-12-10',
    certificateNumber: 'OU-2022-9999',
    status: 'Expiring Soon',
  },
  {
    id: 4,
    title: 'First Aid & CPR',
    issuer: 'Red Crescent Society',
    issueDate: '2021-03-05',
    expiryDate: '2023-03-05',
    certificateNumber: 'RCS-2021-4321',
    status: 'Expired',
  },
];

const professionalActivities: ProfessionalDevelopment[] = [
  {
    id: 1,
    activity: 'AI in Education Workshop',
    type: 'Workshop',
    date: '2025-11-20',
    duration: '2 days',
    organizer: 'Tech Institute Malaysia',
    description: 'Hands-on workshop on integrating artificial intelligence tools in classroom teaching.',
    hoursEarned: 16,
  },
  {
    id: 2,
    activity: 'Student-Centered Learning Seminar',
    type: 'Seminar',
    date: '2025-10-15',
    duration: '1 day',
    organizer: 'Ministry of Education',
    description: 'Exploring modern approaches to student-centered learning and engagement.',
    hoursEarned: 8,
  },
  {
    id: 3,
    activity: 'Advanced Python Programming Course',
    type: 'Course',
    date: '2025-09-01',
    duration: '6 weeks',
    organizer: 'Coursera',
    description: 'Online course on advanced Python programming concepts and best practices.',
    hoursEarned: 30,
  },
  {
    id: 4,
    activity: 'International Educational Conference 2025',
    type: 'Conference',
    date: '2025-08-10',
    duration: '3 days',
    organizer: 'Global Education Forum',
    description: 'Attended keynote sessions and networking events on future of education.',
    hoursEarned: 24,
  },
];

const hrDocuments: HRDocument[] = [
  {
    id: 1,
    title: 'Employment Contract 2024-2026',
    type: 'Contract',
    uploadDate: '2024-01-15',
    fileSize: '245 KB',
    fileName: 'Employment_Contract_2024.pdf',
  },
  {
    id: 2,
    title: 'Annual Performance Evaluation 2024',
    type: 'Evaluation',
    uploadDate: '2024-12-01',
    fileSize: '156 KB',
    fileName: 'Performance_Evaluation_2024.pdf',
  },
  {
    id: 3,
    title: 'Staff Code of Conduct',
    type: 'Policy',
    uploadDate: '2023-08-20',
    fileSize: '89 KB',
    fileName: 'Code_of_Conduct.pdf',
  },
  {
    id: 4,
    title: 'Promotion Letter - Senior Lecturer',
    type: 'Promotion',
    uploadDate: '2024-06-10',
    fileSize: '120 KB',
    fileName: 'Promotion_Letter_2024.pdf',
  },
  {
    id: 5,
    title: 'Salary Slip - November 2025',
    type: 'Other',
    uploadDate: '2025-11-20',
    fileSize: '95 KB',
    fileName: 'Salary_Slip_Nov2025.pdf',
  },
];

export function HRRecords({ onNavigate, onLogout, userName, userRole = 'admin' }: HRRecordsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('certificates');

  const filteredCertificates = trainingCertificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = professionalActivities.filter(activity =>
    activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = hrDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Workshop': 'bg-blue-100 text-blue-800',
      'Seminar': 'bg-purple-100 text-purple-800',
      'Course': 'bg-green-100 text-green-800',
      'Conference': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDocTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Contract': 'bg-blue-100 text-blue-800',
      'Policy': 'bg-indigo-100 text-indigo-800',
      'Evaluation': 'bg-green-100 text-green-800',
      'Promotion': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
          currentView="hr-records"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="HR Records & Documentation"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search Bar */}
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-center">
                    <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search certificates, activities, or documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none text-gray-700"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Record
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-1">Total Certificates</p>
                        <p className="text-3xl font-bold text-blue-900">{trainingCertificates.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-1">Professional Activities</p>
                        <p className="text-3xl font-bold text-green-900">{professionalActivities.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-1">HR Documents</p>
                        <p className="text-3xl font-bold text-purple-900">{hrDocuments.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for different sections */}
              <Card className="shadow-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="certificates">Training Certificates</TabsTrigger>
                    <TabsTrigger value="activities">Professional Development</TabsTrigger>
                    <TabsTrigger value="documents">HR Documents</TabsTrigger>
                  </TabsList>

                  {/* Training Certificates Tab */}
                  <TabsContent value="certificates" className="p-6">
                    <div className="space-y-4">
                      {filteredCertificates.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No certificates found</p>
                      ) : (
                        filteredCertificates.map((cert) => (
                          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                                    <Badge className={getStatusColor(cert.status)}>
                                      {cert.status}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-3">Issued by: {cert.issuer}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Issue Date</p>
                                      <p className="text-gray-900">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Expiry Date</p>
                                      <p className="text-gray-900">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Certificate #</p>
                                      <p className="text-gray-900 font-mono text-xs">{cert.certificateNumber}</p>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Professional Development Tab */}
                  <TabsContent value="activities" className="p-6">
                    <div className="space-y-4">
                      {filteredActivities.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No activities found</p>
                      ) : (
                        filteredActivities.map((activity) => (
                          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{activity.activity}</h3>
                                    <Badge className={getTypeColor(activity.type)}>
                                      {activity.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Date</p>
                                      <p className="text-gray-900">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Duration</p>
                                      <p className="text-gray-900">{activity.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Organizer</p>
                                      <p className="text-gray-900">{activity.organizer}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Hours Earned</p>
                                      <p className="text-gray-900 font-semibold">{activity.hoursEarned}h</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* HR Documents Tab */}
                  <TabsContent value="documents" className="p-6">
                    <div className="space-y-4">
                      {filteredDocuments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No documents found</p>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                                    <Badge className={getDocTypeColor(doc.type)}>
                                      {doc.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-3">File: {doc.fileName}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Upload Date</p>
                                      <p className="text-gray-900">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">File Size</p>
                                      <p className="text-gray-900">{doc.fileSize}</p>
                                    </div>
                                    <div className="col-span-2 flex gap-2 pt-4">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
