import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { RefreshCw, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
interface ReEvaluationRequestProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole: 'teacher' | 'admin' | 'principal';
}

const previousRequests = [
  {
    id: 1,
    requestDate: '2025-11-10',
    category: 'Teaching Effectiveness',
    reason: 'Discrepancy in student evaluation scores',
    status: 'Under Review',
    reviewedBy: 'Principal Office',
    notes: 'Request is being reviewed by the academic committee'
  },
  {
    id: 2,
    requestDate: '2025-10-15',
    category: 'Attendance & Punctuality',
    reason: 'System error in time-out recording',
    status: 'Approved',
    reviewedBy: 'HR Department',
    notes: 'Attendance record corrected. KPI updated accordingly.'
  },
  {
    id: 3,
    requestDate: '2025-09-20',
    category: 'Professional Development',
    reason: 'Missing training certificate not recorded',
    status: 'Approved',
    reviewedBy: 'HR Department',
    notes: 'Certificate verified and added to records.'
  },
];

export function ReEvaluationRequest({ onNavigate, onLogout, userName, userRole }: ReEvaluationRequestProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !reason || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Re-evaluation request submitted successfully');
    setCategory('');
    setReason('');
    setDescription('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Approved': 'bg-green-100 text-green-700',
      'Under Review': 'bg-blue-100 text-blue-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700';
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
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      
      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role={userRole}
          currentView="re-evaluation"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Re-evaluation Request"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Information Banner */}
            <Card className="mb-6 border-l-4 border-l-blue-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-blue-950 mb-2">Request a Re-evaluation</h3>
                    <p className="text-blue-900 text-xs mb-2">
                      If you believe there are discrepancies in your KPI calculation or evaluation data, you can submit 
                      a re-evaluation request. Our team will review your request and respond within 5-7 business days.
                    </p>
                    <p className="text-blue-900 text-xs">
                      Please provide detailed information to help us process your request efficiently.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit New Request</CardTitle>
                  <CardDescription>Fill out the form to request a re-evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="category">KPI Component <span className="text-red-600">*</span></Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teaching-effectiveness">Teaching Effectiveness</SelectItem>
                          <SelectItem value="professional-development">Professional Development</SelectItem>
                          <SelectItem value="school-contribution">School Contribution</SelectItem>
                          <SelectItem value="attendance-punctuality">Attendance & Punctuality</SelectItem>
                          <SelectItem value="innovation-research">Innovation & Research</SelectItem>
                          <SelectItem value="overall">Overall KPI Score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason for Request <span className="text-red-600">*</span></Label>
                      <Input
                        id="reason"
                        placeholder="Brief reason (e.g., Data discrepancy, Missing records)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Detailed Description <span className="text-red-600">*</span></Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about your request, including specific dates, scores, or records that need to be reviewed..."
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800 text-xs">
                          Make sure to provide supporting evidence or documentation if available. 
                          You may be contacted for additional information.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="submit"
                        className="flex-1 bg-blue-900 hover:bg-blue-950"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Submit Request
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setCategory('');
                          setReason('');
                          setDescription('');
                        }}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Request History */}
              <Card>
                <CardHeader>
                  <CardTitle>Request History</CardTitle>
                  <CardDescription>Your previous re-evaluation requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {previousRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                      >

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className="text-gray-600 text-xs">{request.requestDate}</span>
                          </div>
                          <Badge variant="secondary" className={getStatusBadge(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <h4 className="text-gray-900 mb-1">{request.category}</h4>
                        <p className="text-gray-700 text-xs mb-2">{request.reason}</p>
                        
                        <div className="pt-2 mt-2 border-t border-gray-200">
                          <p className="text-gray-600 text-xs mb-1">
                            <strong>Reviewed by:</strong> {request.reviewedBy}
                          </p>
                          <p className="text-gray-600 text-xs">
                            <strong>Notes:</strong> {request.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guidelines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Re-evaluation Guidelines</CardTitle>
                <CardDescription>Important information about the re-evaluation process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-950/10 border border-blue-900/30 rounded-lg">
                    <h4 className="text-blue-950 mb-2">Valid Reasons</h4>
                    <ul className="space-y-1 text-blue-900 text-xs">
                      <li>• Data entry errors or discrepancies</li>
                      <li>• Missing records or documentation</li>
                      <li>• System calculation errors</li>
                      <li>• Unrecorded achievements or activities</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-blue-900 mb-2">Processing Timeline</h4>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li>• Initial review: 2-3 business days</li>
                      <li>• Investigation period: 3-5 business days</li>
                      <li>• Final decision: Within 7 business days</li>
                      <li>• Appeal option: Available if rejected</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-blue-900 mb-2">What to Include</h4>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li>• Specific dates and time periods</li>
                      <li>• Relevant documentation</li>
                      <li>• Detailed explanation of the issue</li>
                      <li>• Expected outcome or correction</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-blue-900 mb-2">Important Notes</h4>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li>• One request per KPI component</li>
                      <li>• Supporting evidence is required</li>
                      <li>• Decisions are final after appeal</li>
                      <li>• False claims may affect credibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}