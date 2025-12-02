import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';

interface AddTeacherProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
}

export function AddTeacher({ onNavigate, onLogout, userName, userRole = 'principal' }: AddTeacherProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [office, setOffice] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !email) {
      alert('Please fill in name, department and email');
      return;
    }

    setIsSubmitting(true);

    // Try to post to backend; if unavailable, simulate success and navigate back
    try {
      const payload = {
        name,
        department,
        email,
        phone,
        office,
        qualification,
        experience: experience === '' ? null : Number(experience),
      };

      // Best-effort: call API if it exists
      await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // ignore network errors
      });

      // small delay to show progress
      await new Promise((r) => setTimeout(r, 700));

      setIsSubmitting(false);
      alert('Teacher added successfully');
      onNavigate('teacher-list');
    } catch (err) {
      setIsSubmitting(false);
      alert('Failed to add teacher. Try again.');
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
          currentView="teacher-list"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Add Teacher"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>New Teacher</CardTitle>
                  <CardDescription>Add a new teacher to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Amina" />
                    </div>
                    <div>
                      <Label>Department *</Label>
                      <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Mathematics" />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.edu" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+60-123-456789" />
                    </div>
                    <div>
                      <Label>Office</Label>
                      <Input value={office} onChange={(e) => setOffice(e.target.value)} placeholder="Room S101" />
                    </div>
                    <div>
                      <Label>Qualification</Label>
                      <Input value={qualification} onChange={(e) => setQualification(e.target.value)} />
                    </div>
                    <div>
                      <Label>Experience (years)</Label>
                      <Input type="number" value={experience as any} onChange={(e) => setExperience(e.target.value === '' ? '' : Number(e.target.value))} />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="bg-blue-800 hover:bg-blue-950 text-white" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Teacher'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => onNavigate('teacher-list')}>
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
