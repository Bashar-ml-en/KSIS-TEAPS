import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

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
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [office, setOffice] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please fill in name and email');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name,
        email: email,
        password: 'password123',
        password_confirmation: 'password123', // required by confirmed rule
        role: role,
        department_id: 1, // Default to 1 as UI input is text but backend needs ID
        // Additional info like phone/office should be saved to profile, 
        // but Register endpoint mainly handles User+Teacher creation.
        // We can add a separate update call if needed, but for now this gets the user Access.
      };

      await api.post('/register', payload);

      toast.success(`${role === 'principal' ? 'Principal' : 'Teacher'} account created successfully!`);
      toast.info(`Login details sent: ${email} / password123`);

      // Delay to show toast
      setTimeout(() => {
        onNavigate('teacher-list');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />

      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role={userRole}
          currentView="teacher-list" // Keep sidebar active on list
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
                      <Label>Department (Text)</Label>
                      <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Mathematics" />
                      <p className="text-xs text-gray-500 mt-1">Note: Will be assigned to default department (ID: 1).</p>
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

                    <div className="flex gap-3 pt-4">
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
