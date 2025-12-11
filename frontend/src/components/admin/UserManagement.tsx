import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Users, UserPlus, Search, Edit, Trash2, Shield, Loader2, Save } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'hr_admin' | 'principal' | 'teacher';
    department_id?: number;
    created_at: string;
}

interface UserManagementProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'admin';
}

export function UserManagement({ onNavigate, onLogout, userName, userRole }: UserManagementProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New User State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'teacher' as 'teacher' | 'principal' | 'hr_admin',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.data || response.data);
        } catch (error: any) {
            console.error('Failed to load users:', error);
            toast.error(error.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            let endpoint = '';
            let payload: any = {
                full_name: newUser.name,
                email: newUser.email,
                password: 'password123', // Default password
            };

            switch (newUser.role) {
                case 'teacher':
                    endpoint = '/teachers';
                    payload = {
                        ...payload,
                        employee_id: 'T' + Date.now().toString().slice(-6),
                        department_id: null, // Optional now
                        specialization: null
                    };
                    break;
                case 'principal':
                    endpoint = '/principals';
                    payload = {
                        ...payload,
                        school_name: 'KSIS International School',
                        date_appointed: new Date().toISOString().split('T')[0]
                    };
                    break;
                case 'hr_admin':
                    endpoint = '/hr-admins';
                    payload = {
                        ...payload,
                        employee_id: 'HR' + Date.now().toString().slice(-6),
                        department: 'Human Resources'
                    };
                    break;
            }

            await api.post(endpoint, payload);
            toast.success(`${newUser.role === 'hr_admin' ? 'HR Admin' : newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} created successfully!`);
            setIsAddUserOpen(false);
            setNewUser({ name: '', email: '', role: 'teacher' });
            loadUsers();
        } catch (error: any) {
            console.error('Failed to create user:', error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${userId}`); // This might need to be role specific in backend, but let's try generic
            toast.success('User deleted successfully');
            loadUsers();
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            // Fallback: try to delete from specific endpoint if generic fails or if explicit delete is needed
            toast.error('Could not delete user. API might require role-specific deletion.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'hr_admin': return 'bg-purple-100 text-purple-800';
            case 'principal': return 'bg-blue-100 text-blue-800';
            case 'teacher': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="admin-users"
                onNavigate={onNavigate}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    userName={userName}
                    userRole={userRole}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-8 h-8 text-blue-600" />
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage system users and permissions</p>
                    </div>

                    {/* Actions Bar */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 w-full md:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Add User Button */}
                            <Button
                                onClick={() => setIsAddUserOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add New User
                            </Button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No users found</p>
                                {searchTerm && (
                                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role === 'hr_admin' ? 'HR Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => toast.info('Edit functionality coming soon')}
                                                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>

                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account. Default password will be 'password123'.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="col-span-3"
                                    placeholder="user@school.edu"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Role</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="principal">Principal</SelectItem>
                                            <SelectItem value="hr_admin">HR Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateUser} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                                ) : (
                                    'Create User'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
