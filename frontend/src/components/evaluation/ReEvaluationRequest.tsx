import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import api from '../../services/api';

interface ReEvaluationRequestProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole: 'teacher' | 'admin' | 'principal';
}

interface ReevaluationRequest {
  id: number;
  teacher_id: number;
  evaluation_id?: number;
  reason: string;
  supporting_evidence?: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  principal_response?: string;
  reviewed_date?: string;
  created_at: string;
}

export function ReEvaluationRequest({ onNavigate, onLogout, userName, userRole }: ReEvaluationRequestProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<ReevaluationRequest[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get teacher profile
      const profileRes = await api.get('/user/profile');
      console.log('Profile data:', profileRes.data);

      const tId = profileRes.data.teacher_id || profileRes.data.teacher?.id;
      setTeacherId(tId);

      // Load existing re-evaluation requests
      if (tId) {
        const requestsRes = await api.get(`/reevaluation-requests?teacher_id=${tId}`);
        console.log('Re-evaluation requests:', requestsRes.data);
        setRequests(requestsRes.data.data || requestsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load re-evaluation data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !reason || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!teacherId) {
      toast.error('Teacher profile not found. Please contact support.');
      return;
    }

    setSubmitting(true);
    try {
      // Create re-evaluation request
      const response = await api.post('/reevaluation-requests', {
        teacher_id: teacherId,
        evaluation_id: null, // Can be updated later if linked to specific evaluation
        reason: `${category}: ${reason}`,
        supporting_evidence: description,
      });

      console.log('Created request:', response.data);

      // If status is draft, submit it immediately
      const requestId = response.data.request.id;
      if (response.data.request.status === 'draft') {
        await api.post(`/reevaluation-requests/${requestId}/submit`);
      }

      toast.success('Re-evaluation request submitted successfully!');

      // Clear form
      setCategory('');
      setReason('');
      setDescription('');

      // Reload requests
      await loadData();
    } catch (error: any) {
      console.error('Failed to submit request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit request';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'approved': 'bg-green-100 text-green-700',
      'pending': 'bg-blue-100 text-blue-700',
      'rejected': 'bg-red-100 text-red-700',
      'draft': 'bg-yellow-100 text-yellow-700'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                          <SelectItem value="Teaching Effectiveness">Teaching Effectiveness</SelectItem>
                          <SelectItem value="Professional Development">Professional Development</SelectItem>
                          <SelectItem value="School Contribution">School Contribution</SelectItem>
                          <SelectItem value="Attendance & Punctuality">Attendance & Punctuality</SelectItem>
                          <SelectItem value="Innovation & Research">Innovation & Research</SelectItem>
                          <SelectItem value="Overall KPI Score">Overall KPI Score</SelectItem>
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
                        disabled={submitting}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {submitting ? 'Submitting...' : 'Submit Request'}
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
                        disabled={submitting}
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
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading requests...
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No re-evaluation requests yet</p>
                      <p className="text-xs mt-1">Submit your first request using the form</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div
                          key={request.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <span className="text-gray-600 text-xs">{formatDate(request.created_at)}</span>
                            </div>
                            <Badge variant="secondary" className={getStatusBadge(request.status)}>
                              {request.status}
                            </Badge>
                          </div>

                          <h4 className="text-gray-900 mb-1 font-medium">{request.reason}</h4>
                          <p className="text-gray-700 text-xs mb-2">{request.supporting_evidence}</p>

                          {request.principal_response && (
                            <div className="pt-2 mt-2 border-t border-gray-200">
                              <p className="text-gray-600 text-xs mb-1">
                                <strong>Principal Response:</strong> {request.principal_response}
                              </p>
                              {request.reviewed_date && (
                                <p className="text-gray-500 text-xs">
                                  Reviewed on: {formatDate(request.reviewed_date)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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