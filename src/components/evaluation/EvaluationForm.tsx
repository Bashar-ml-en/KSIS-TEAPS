import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import backgroundImage from '../../assets/aiu-students.jpg';
import { View } from '../../App';
interface EvaluationFormProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

const evaluationCategories = [
  {
    id: 1,
    category: 'Teaching Effectiveness',
    questions: [
      'The teacher demonstrates mastery of the subject matter',
      'The teacher presents lessons clearly and logically',
      'The teacher uses effective teaching methods',
      'The teacher encourages student participation',
    ],
  },
  {
    id: 2,
    category: 'Classroom Management',
    questions: [
      'The teacher maintains a conducive learning environment',
      'The teacher manages class time effectively',
      'The teacher handles discipline fairly',
    ],
  },
  {
    id: 3,
    category: 'Student Engagement',
    questions: [
      'The teacher shows enthusiasm for teaching',
      'The teacher is approachable and available for consultation',
      'The teacher provides constructive feedback',
    ],
  },
];

export function EvaluationForm({ onNavigate, onLogout, userName = 'John Student' }: EvaluationFormProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (questionIndex: string, value: string) => {
    setRatings((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success message
    setTimeout(() => {
      onNavigate('student');
    }, 3000);
  };

  const handleCancel = () => {
    onNavigate('student');
  };

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
        backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md" />
        
        <Card className="w-full max-w-md relative z-10">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-green-900 mb-2">Thank You!</h2>
            <p className="text-green-700 mb-4">
              Your evaluation has been submitted successfully.
            </p>
            <p className="text-gray-600 text-xs">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen overflow-hidden relative"
      style={{
        backgroundImage: "url('../../assets/aiu-students.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      
      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role="principal"
          currentView="evaluation-form"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Evaluation Form"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Student Teacher Evaluation Form</CardTitle>
                  <CardDescription>
                    Please rate your teacher honestly and constructively. Your feedback helps improve the quality of education.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Teacher Selection */}
                    <div>
                      <Label htmlFor="teacher">Select Teacher and Subject</Label>
                      <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose a teacher to evaluate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nadiah - sf5">Nadiah - SF 5: Student Formation 5</SelectItem>
                          <SelectItem value="zukifli-it307">Zukifli - IT 307: Web Systems and Technologies 2</SelectItem>
                          <SelectItem value="sarah-it306">Sarah - IT 306: Game Development</SelectItem>
                          <SelectItem value="halawati-it305">Halawati - IT 305: Mobile Application Development</SelectItem>
                          <SelectItem value="mozaherul-it304">Mozaherul - IT 304: Information Assurance and Security 1</SelectItem>
                          
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Evaluation Categories */}
                    {evaluationCategories.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <div className="pb-2 border-b border-gray-200">
                          <h3 className="text-blue-950">{category.category}</h3>
                        </div>

                        {category.questions.map((question, qIndex) => {
                          const questionKey = `${category.id}-${qIndex}`;
                          return (
                            <div key={questionKey} className="space-y-3">
                              <Label className="text-gray-700">{question}</Label>
                              <RadioGroup
                                value={ratings[questionKey] || ''}
                                onValueChange={(value) => handleRatingChange(questionKey, value)}
                                className="flex gap-4 flex-wrap"
                              >
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <div key={rating} className="flex items-center space-x-2">
                                    <RadioGroupItem value={rating.toString()} id={`${questionKey}-${rating}`} />
                                    <Label
                                      htmlFor={`${questionKey}-${rating}`}
                                      className="cursor-pointer"
                                    >
                                      {rating}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <p className="text-gray-500 text-xs">1 = Poor, 5 = Excellent</p>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Comments Section */}
                    <div className="space-y-2">
                      <Label htmlFor="comments">Additional Comments (Optional)</Label>
                      <Textarea
                        id="comments"
                        placeholder="Share any additional feedback or suggestions..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    {/* API Call Indicator */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-900 text-xs">
                        <strong>API Integration:</strong> Form submission will trigger POST request to /api/evaluations/submit
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-900 hover:bg-blue-950"
                        disabled={isSubmitting || !selectedTeacher}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Evaluation'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}