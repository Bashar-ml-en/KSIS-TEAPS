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
  const [role, setRole] = useState<'teacher' | 'principal'>('teacher');
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [office, setOffice] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in name and email');
      return;
    }

    setIsSubmitting(true);

    try {
      // Common payload fields
      const commonPayload = {
        full_name: name, // Backend expects full_name
        email,
        password: 'password123', // Default password
        phone,
        qualifications: qualification,
        employee_id: (role === 'principal' ? 'P' : 'T') + Date.now().toString().slice(-6), // Auto-generate unique ID
      };

      let payload: any = { ...commonPayload };

      if (role === 'teacher') {
        payload = {
          ...payload,
          department_id: null,
          office,
          experience: experience === '' ? null : Number(experience),
          specialization: null,
        };
      } else {
        // Principal specific fields
        payload = {
          ...payload,
          school_name: 'KSIS International School',
          date_appointed: new Date().toISOString().split('T')[0],
        };
      }

      // Determine endpoint based on role
      const endpoint = role === 'principal' ? '/api/principals' : '/api/teachers';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add auth token if available (usually handled by interceptor, but good to be safe)
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      // small delay to show progress
      await new Promise((r) => setTimeout(r, 700));

      setIsSubmitting(false);
      alert(`${role === 'principal' ? 'Principal' : 'Teacher'} added successfully!\n\nLogin Email: ${email}\nPassword: password123`);
      onNavigate('teacher-list');
    } catch (err: any) {
      setIsSubmitting(false);
      console.error(err);
      alert(`Failed to add ${role}: ${err.message}`);
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
            title="Add New User"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Add New User</CardTitle>
                  <CardDescription>Create a new teacher or principal account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Role *</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'teacher' | 'principal')}
                      >
                        <option value="teacher">Teacher</option>
                        <option value="principal">Principal</option>
                      </select>
                    </div>

                    <div>
                      <Label>Full Name *</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Amina" />
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@school.edu" />
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
                        {isSubmitting ? 'Saving...' : 'Create Account'}
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
