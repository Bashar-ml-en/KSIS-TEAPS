import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Settings, Calendar, AlertCircle, UserPlus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

const users = [
  { id: 1, name: 'Mdm Fadhilahism', email: 'Fadhilahism@ksis.edu', role: 'Principal', status: 'Active' },
  { id: 2, name: 'Mdm Nadiah', email: 'nadiah@ksis.edu', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'Dr. Mozaherul', email: 'moza@ksis.edu', role: 'Teacher', status: 'Active' },
  { id: 4, name: 'Mdm Halawati', email: 'halawati@ksis.edu', role: 'Teacher', status: 'Active' },
  { id: 5, name: 'Dr Umi', email: 'umi@ksis.edu', role: 'Teacher', status: 'Active' },
  { id: 6, name: 'Mr.Zukifli', email: 'zukifli@ksis.edu', role: 'Teacher', status: 'Active' },
];

const systemNotifications = [
  { id: 1, message: 'Evaluation period ends in 7 days', type: 'warning', date: '2025-11-13' },
  { id: 2, message: '45 new submissions today', type: 'info', date: '2025-11-13' },
  { id: 3, message: 'System backup completed successfully', type: 'success', date: '2025-11-12' },
];

export function AdminDashboard({ onNavigate, onLogout, userName: propUserName }: AdminDashboardProps) {
  const { user, refreshUser } = useAuth();
  const userName = user?.name || propUserName || 'Admin User';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const handleProfileImageChange = async (file: File) => {
    try {
      await authService.updateProfilePhoto(file);
      await refreshUser();
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile photo");
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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role="admin"
          currentView="admin"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Admin Dashboard"
            userName={userName}
            userRole="admin"
            userProfileImage={user?.profile_photo_url}
            onProfileImageChange={handleProfileImageChange}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Total Users</p>
                      <p className="text-blue-900">245</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Active Evaluations</p>
                      <p className="text-green-600">38</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Teachers</p>
                      <p className="text-blue-600">42</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">System Status</p>
                      <p className="text-green-600">Online</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage system users and permissions</CardDescription>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-900 hover:bg-blue-950">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>
                            Create a new user account for the evaluation system
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter full name" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter email address" />
                          </div>
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="principal">Principal</SelectItem>
                                <SelectItem value="admin">HR/Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1 bg-blue-900 hover:bg-blue-950">
                              Create User
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setIsAddUserOpen(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-900">{user.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-xs">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4 text-blue-900" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure evaluation system parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-950/10 rounded-lg border border-blue-900/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-blue-900" />
                        <h4 className="text-blue-950">Evaluation Period</h4>
                      </div>
                      <p className="text-blue-900 text-xs mb-3">
                        Configure the active evaluation period
                      </p>
                      <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                        Configure Period
                      </Button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h4 className="text-blue-900">Schedule Evaluations</h4>
                      </div>
                      <p className="text-blue-700 text-xs mb-3">
                        Set up automated evaluation schedules
                      </p>
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                        Manage Schedule
                      </Button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h4 className="text-blue-900">System Preferences</h4>
                      </div>
                      <p className="text-blue-700 text-xs mb-3">
                        Adjust general system settings
                      </p>
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                        View Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Recent system events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemNotifications.map((notification) => (
                    <div key={notification.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${notification.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : notification.type === 'info'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-green-50 border-green-200'
                        }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 mt-0.5 ${notification.type === 'warning'
                            ? 'text-yellow-600'
                            : notification.type === 'info'
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                      />
                      <div className="flex-1">
                        <p
                          className={
                            notification.type === 'warning'
                              ? 'text-yellow-900'
                              : notification.type === 'info'
                                ? 'text-blue-900'
                                : 'text-green-900'
                          }
                        >
                          {notification.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${notification.type === 'warning'
                              ? 'text-yellow-700'
                              : notification.type === 'info'
                                ? 'text-blue-700'
                                : 'text-green-700'
                            }`}
                        >
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}