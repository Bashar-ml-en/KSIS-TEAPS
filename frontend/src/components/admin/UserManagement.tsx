import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Users, UserPlus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

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

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.data || response.data);
            toast.success('Users loaded successfully');
        } catch (error: any) {
            console.error('Failed to load users:', error);
            toast.error(error.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${userId}`);
            toast.success('User deleted successfully');
            loadUsers();
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'hr_admin':
                return 'bg-purple-100 text-purple-800';
            case 'principal':
                return 'bg-blue-100 text-blue-800';
            case 'teacher':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'hr_admin':
                return 'HR Admin';
            case 'principal':
                return 'Principal';
            case 'teacher':
                return 'Teacher';
            default:
                return role;
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
                            <button
                                onClick={() => onNavigate('add-teacher')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                                <UserPlus className="w-5 h-5" />
                                Add New User
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
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
                                                        {getRoleLabel(user.role)}
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
                                                            title="Edit user"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete user"
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

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                </div>
                                <Users className="w-10 h-10 text-blue-600 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Teachers</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(u => u.role === 'teacher').length}
                                    </p>
                                </div>
                                <Users className="w-10 h-10 text-green-600 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Admins</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(u => u.role === 'hr_admin' || u.role === 'principal').length}
                                    </p>
                                </div>
                                <Shield className="w-10 h-10 text-purple-600 opacity-20" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
