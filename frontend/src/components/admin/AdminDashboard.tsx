import { useState, useEffect } from 'react';

import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Settings, Calendar, AlertCircle, UserPlus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { adminService, AdminDashboardStats } from '../../services/adminService';
import api from '../../services/api';

interface AdminDashboardProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
}

export function AdminDashboard({ onNavigate, onLogout, userName: propUserName }: AdminDashboardProps) {
  const { user, refreshUser } = useAuth();
  const userName = user?.name || propUserName || 'Admin User';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, notifData] = await Promise.all([
        adminService.getDashboardStats(),
        api.get('/notifications').then(res => res.data.data || res.data).catch(() => [])
      ]);
      setStats(statsData);
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } catch (error) {
      console.error('Failed to load admin dashboard data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar is handled by the layout wrapper in most apps, but here it seems nested? 
          The Sidebar component we just fixed handles its own positioning on mobile/desktop. 
          We just need to place it here.
      */}
      <Sidebar
        role="admin"
        currentView="admin-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Admin Dashboard"
          userName={userName}
          userRole="admin"
          userProfileImage={user?.profile_photo_url}
          onProfileImageChange={handleProfileImageChange}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading dashboard...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 mb-1 text-sm font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.stats.total_users ?? 0}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 mb-1 text-sm font-medium">Active Evaluations</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.stats.active_evaluations ?? 0}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 mb-1 text-sm font-medium">Total Teachers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.stats.total_teachers ?? 0}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 mb-1 text-sm font-medium">System Status</p>
                        <p className="text-lg font-bold text-green-600">{stats?.stats.system_status ?? 'Online'}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Management */}
                <Card className="bg-white shadow h-full">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">Recent Users</CardTitle>
                        <CardDescription>Recently registered users</CardDescription>
                      </div>
                      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                              Create a new user account for the evaluation system.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <p className="text-sm text-gray-600">Please visit the User Management page to add users with full details.</p>
                            <div className="flex gap-2 pt-4">
                              <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  setIsAddUserOpen(false);
                                  onNavigate('admin-users');
                                }}
                              >
                                Go to User Management
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
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {stats?.recent_users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-gray-900 font-medium text-sm">{user.name}</h4>
                              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700">
                                {user.role}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => onNavigate('admin-users')}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                      {stats?.recent_users.length === 0 && (
                        <p className="text-gray-500 text-center py-6 border-dashed border-2 border-gray-100 rounded-lg">No recently active users</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-blue-600 text-sm font-medium"
                      onClick={() => onNavigate('admin-users')}
                    >
                      View All Users
                    </Button>
                  </CardContent>
                </Card>

                {/* System Settings */}
                <Card className="bg-white shadow h-full">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">System Settings</CardTitle>
                    <CardDescription>Configure evaluation system parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-blue-600" />
                          </div>
                          <h4 className="text-blue-900 font-semibold text-sm">Evaluation Period</h4>
                        </div>
                        <p className="text-gray-600 text-xs mb-3 pl-11">
                          Configure the active evaluation period
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                          onClick={() => onNavigate('admin-settings')}
                        >
                          Configure Period
                        </Button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-center text-gray-400 text-xs py-2 font-medium">
                          More settings available in System Settings page
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full mt-1 text-gray-600 hover:bg-gray-200/50 text-sm"
                          onClick={() => onNavigate('admin-settings')}
                        >
                          View All Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Notifications */}
              <Card className="bg-white shadow">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900">System Notifications</CardTitle>
                  <CardDescription>Recent system events and alerts</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <AlertCircle className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification, i) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-blue-50 bg-blue-50/30"
                        >
                          <AlertCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-sm font-medium">{notification.data?.message || notification.type || 'Notification'}</p>
                            <p className="text-xs mt-1 text-gray-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}