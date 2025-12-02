import { useState } from 'react';
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
  rating: number;
  comment: string;
  fileName?: string;
  evaluatedBy: string;
}

const sampleTeachers = [
  'Dr. Mozaherul Islam',
  'Mdm Nadiah Arsat',
  'Mr Zukifli Ahmad',
  'Dr. Umi Safiah',
  'Mdm Halawati Hassan',
];

const initialEvaluations: EvaluationComment[] = [
  {
    id: 1,
    teacherName: 'Dr. Mozaherul Islam',
    date: '2025-11-15',
    rating: 5,
    comment: 'Excellent teaching methodology and student engagement. Consistently high performance.',
    evaluatedBy: 'Principal',
  },
  {
    id: 2,
    teacherName: 'Mdm Nadiah Arsat',
    date: '2025-11-10',
    rating: 4,
    comment: 'Good classroom management. Could improve on incorporating more interactive activities.',
    evaluatedBy: 'HR Admin',
  },
];

export function TeacherEvaluation({ onNavigate, onLogout, userName, userRole = 'principal' }: TeacherEvaluationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationComment[]>(initialEvaluations);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);

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
    if (!selectedTeacher || !comment) {
      alert('Please select a teacher and add a comment');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newEvaluation: EvaluationComment = {
      id: evaluations.length + 1,
      teacherName: selectedTeacher,
      date: new Date().toISOString().split('T')[0],
      rating: parseInt(rating),
      comment,
      fileName: uploadedFiles.length > 0 ? uploadedFiles[0].name : undefined,
      evaluatedBy: userRole === 'principal' ? 'Principal' : 'HR Admin',
    };

    setEvaluations([...evaluations, newEvaluation]);
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedTeacher('');
      setRating('5');
      setComment('');
      setUploadedFiles([]);
    }, 2000);
  };

  if (!showForm) {
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
              title="Teacher Evaluations"
              userName={userName}
              onMenuClick={() => setSidebarOpen(true)}
            />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <Button 
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Add Evaluation
                </Button>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation History</CardTitle>
                    <CardDescription>Comments and feedback submitted for teachers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {evaluations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No evaluations yet</p>
                      ) : (
                        evaluations.map((evaluation) => (
                          <Card key={evaluation.id} className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{evaluation.teacherName}</h3>
                                  <p className="text-sm text-gray-500">{evaluation.date} • By {evaluation.evaluatedBy}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-blue-600">{evaluation.rating}</div>
                                  <p className="text-xs text-gray-500">out of 5</p>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">{evaluation.comment}</p>
                              {evaluation.fileName && (
                                <p className="text-sm text-green-600">📎 {evaluation.fileName}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
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
              <Button 
                onClick={() => setShowForm(false)}
                variant="outline"
                className="mb-6"
              >
                View History
              </Button>

              {isSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-green-900 font-semibold mb-2">Evaluation Submitted!</h2>
                    <p className="text-green-700">
                      Your feedback for {selectedTeacher} has been recorded and will appear in their teacher dashboard.
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
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleTeachers.map((teacher) => (
                              <SelectItem key={teacher} value={teacher}>
                                {teacher}
                              </SelectItem>
                            ))}
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

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Attach Supporting Documents (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm mb-2">Drag and drop files or click to browse</p>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Choose Files
                          </Button>
                        </div>

                        {/* Display uploaded files */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p>
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                        
  <div className="flex flex-col gap-3 w-full bg-blue-100 p-4 rounded-xl">
  <Button 
    type="submit" 
    className="w-full bg-blue-800 hover:bg-blue-700 text-white"
    disabled={isSubmitting}
  >
    Submit Evaluation
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
