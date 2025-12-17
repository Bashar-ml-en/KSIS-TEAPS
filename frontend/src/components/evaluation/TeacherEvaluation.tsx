import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckCircle, Loader2, Upload, X, FileText, ArrowLeft } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

interface TeacherEvaluationProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'admin';
}

interface EvaluationComment {
  id: number;
  teacherName: string;
  date: string;
  rating: number; // Frontend rating, might be stored in text if backend doesn't support it
  comment: string;
  fileName?: string;
  evaluatedBy: string;
}

export function TeacherEvaluation({ onNavigate, onLogout, userName, userRole = 'principal' }: TeacherEvaluationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationComment[]>([]); // This would ideally fetch from backend too
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    loadTeachers();
    loadProfile();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setTeachers(list);
    } catch (error) {
      console.error('Failed to load teachers', error);
      toast.error('Failed to load teachers list');
    }
  };

  const loadProfile = async () => {
    try {
      const response = await api.get('/user');
      setUserId(response.data.id);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !comment || !userId) {
      toast.error('Please select a teacher, add a comment, and ensure you are logged in.');
      return;
    }

    setIsSubmitting(true);

    // Construct feedback text with rating included (since backend Feedback model is text-centric)
    const feedbackText = `[Rating: ${rating}/5] ${comment}`;

    try {
      await api.post('/feedback', {
        teacher_id: parseInt(selectedTeacherId),
        feedback_type: userRole === 'admin' ? 'hr' : 'principal', // Map 'admin' to 'hr'
        feedback_by: userId,
        feedback_text: feedbackText
      });

      // Add to local list for display (optional, really we should refetch)
      const selectedTeacherName = teachers.find(t => t.id.toString() === selectedTeacherId)?.full_name || 'Teacher';

      const newEvaluation: EvaluationComment = {
        id: Date.now(),
        teacherName: selectedTeacherName,
        date: new Date().toISOString().split('T')[0],
        rating: parseInt(rating),
        comment,
        fileName: uploadedFiles.length > 0 ? uploadedFiles[0].name : undefined,
        evaluatedBy: userName || 'User',
      };

      setEvaluations([newEvaluation, ...evaluations]);
      setIsSubmitted(true);
      toast.success('Evaluation submitted successfully');

      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedTeacherId('');
        setRating('5');
        setComment('');
        setUploadedFiles([]);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit evaluation', error);
      toast.error('Failed to submit evaluation');
    } finally {
      setIsSubmitting(false);
    }
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
          currentView="teacher-evaluation"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Teacher Evaluation & Feedback"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-2xl mx-auto">
              {/* <Button 
                onClick={() => setShowForm(false)}
                variant="outline"
                className="mb-6"
              >
                View History
              </Button> */
                /* History view implementation is future work, keeping it simple for now */
              }

              {isSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-green-900 font-semibold mb-2">Evaluation Submitted!</h2>
                    <p className="text-green-700">
                      Your feedback has been recorded and will be analyzed by the AI system.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Add Teacher Evaluation</CardTitle>
                    <CardDescription>
                      Provide feedback and rating for teacher performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Teacher Selection */}
                      <div>
                        <Label htmlFor="teacher">Select Teacher *</Label>
                        <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a teacher" />
                          </SelectTrigger>
                          <SelectContent max-h="200px">
                            {teachers.length === 0 ? (
                              <SelectItem value="loading" disabled>Loading teachers...</SelectItem>
                            ) : (
                              teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                  {teacher.full_name || teacher.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rating */}
                      <div>
                        <Label htmlFor="rating">Performance Rating (1-5) *</Label>
                        <Select value={rating} onValueChange={setRating}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Needs Improvement</SelectItem>
                            <SelectItem value="2">2 - Below Average</SelectItem>
                            <SelectItem value="3">3 - Average</SelectItem>
                            <SelectItem value="4">4 - Good</SelectItem>
                            <SelectItem value="5">5 - Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Comment */}
                      <div>
                        <Label htmlFor="comment">Evaluation Comments *</Label>
                        <Textarea
                          id="comment"
                          placeholder="Provide detailed feedback on the teacher's performance, strengths, and areas for improvement..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      {/* File Upload (Visual only for now as Feedback API is text only in this iteration) */}
                      <div className="space-y-2 opacity-50 pointer-events-none" title="File upload not available in quick feedback">
                        <Label htmlFor="file-upload">Attach Supporting Documents (Currently Disabled)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm mb-2">Drag and drop files or click to browse</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled
                          >
                            Choose Files
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full bg-blue-100 p-4 rounded-xl">
                        <Button
                          type="submit"
                          className="w-full bg-blue-800 hover:bg-blue-700 text-white"
                          disabled={isSubmitting || teachers.length === 0}
                        >
                          {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                          ) : 'Submit Evaluation'}
                        </Button>

                      </div>

                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
