import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, CheckCircle, XCircle, Clock, Target, Send } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

interface KPIRequestProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'teacher';
}

interface KPIRequestItem {
    id: number;
    kpi_title: string;
    kpi_description: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    principal_comments?: string;
}

export function KPIRequest({ onNavigate, onLogout, userName, userRole }: KPIRequestProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState<KPIRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [departmentName, setDepartmentName] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        kpi_title: '',
        kpi_description: '',
        category: 'Teaching & Learning',
        justification: '',
        target_value: '',
        measurement_criteria: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Fetch user profile to get department and teacher ID
            const userRes = await api.get('/user/profile');
            const teacherId = userRes.data.teacher_id;

            // Set department name if available in profile
            if (userRes.data.department) {
                setDepartmentName(userRes.data.department.name);
            } else if (userRes.data.teacher && userRes.data.teacher.department) {
                setDepartmentName(userRes.data.teacher.department.name);
            }

            if (teacherId) {
                const response = await api.get(`/kpi-requests?teacher_id=${teacherId}`);
                setRequests(response.data.data || response.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load KPI data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const userRes = await api.get('/user/profile');
            const teacherId = userRes.data.teacher_id;

            if (!teacherId) throw new Error('Teacher profile not found');

            await api.post('/kpi-requests', {
                ...formData,
                teacher_id: teacherId
            });

            toast.success('KPI Request submitted successfully');
            setShowForm(false);
            setFormData({
                kpi_title: '',
                kpi_description: '',
                category: 'Teaching & Learning',
                justification: '',
                target_value: '',
                measurement_criteria: ''
            });
            loadData();
        } catch (error) {
            console.error('Failed to submit KPI request:', error);
            toast.error('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" /> Pending Review</Badge>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="kpi-request"
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
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">KPI Management</h1>
                                <p className="text-gray-600 mt-1">
                                    Department: <span className="font-semibold text-blue-700">{departmentName || 'Loading...'}</span>
                                </p>
                            </div>
                            <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 shadow-sm text-white">
                                {showForm ? 'Cancel Request' : <><Plus className="w-4 h-4 mr-2" /> Create New KPI</>}
                            </Button>
                        </div>

                        {/* Process Guide - Now Interactive */}
                        {!showForm && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* 1. Define KPI - Opens form */}
                                <Card
                                    className="bg-white border-l-4 border-l-blue-500 shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                                    onClick={() => setShowForm(true)}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">1. Define KPI</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Set a SMART goal aligned with your department's objectives. Define clear targets and measurement criteria.
                                        </p>
                                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            <Plus className="w-4 h-4 mr-1" /> Create New KPI
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* 2. Submit & Review - Shows pending count */}
                                <Card
                                    className="bg-white border-l-4 border-l-yellow-500 shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                                    onClick={() => {
                                        const el = document.getElementById('requests-table');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">2. Submit & Review</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Submit your request. Your Principal will review it to ensure it meets the standards.
                                        </p>
                                        <div className="flex items-center justify-between bg-yellow-50 p-2 rounded-lg">
                                            <span className="text-sm text-yellow-700">Pending Review:</span>
                                            <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-200">
                                                {requests.filter(r => r.status === 'pending').length}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 3. Track Progress - Shows approved count */}
                                <Card
                                    className="bg-white border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                                    onClick={() => {
                                        const el = document.getElementById('requests-table');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">3. Track Progress</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Once approved, the KPI becomes active. Track your progress and upload evidence.
                                        </p>
                                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                                            <span className="text-sm text-green-700">Active KPIs:</span>
                                            <Badge className="bg-green-200 text-green-800 hover:bg-green-200">
                                                {requests.filter(r => r.status === 'approved').length}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}


                        {/* Form Section */}
                        {showForm && (
                            <Card className="border-blue-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                                <CardHeader className="bg-blue-50 border-b border-blue-100">
                                    <CardTitle className="text-blue-900">Create New KPI Request</CardTitle>
                                    <CardDescription className="text-blue-700">
                                        Please ensure your KPI is Specific, Measurable, Achievable, Relevant, and Time-bound.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700">KPI Title <span className="text-red-500">*</span></Label>
                                                <Input
                                                    required
                                                    value={formData.kpi_title}
                                                    onChange={e => setFormData({ ...formData, kpi_title: e.target.value })}
                                                    placeholder="e.g., Increase Student Participation in Science Fair"
                                                    className="border-gray-300 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-700">Category <span className="text-red-500">*</span></Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    <option>Teaching & Learning</option>
                                                    <option>Professional Development</option>
                                                    <option>Community Engagement</option>
                                                    <option>Research & Innovation</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Description <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                required
                                                value={formData.kpi_description}
                                                onChange={e => setFormData({ ...formData, kpi_description: e.target.value })}
                                                placeholder="Describe exactly what you intend to achieve..."
                                                className="min-h-[100px] border-gray-300 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700">Target Value</Label>
                                                <Input
                                                    value={formData.target_value}
                                                    onChange={e => setFormData({ ...formData, target_value: e.target.value })}
                                                    placeholder="e.g., 90% attendance, 5 workshops"
                                                    className="border-gray-300 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-700">Measurement Criteria</Label>
                                                <Input
                                                    value={formData.measurement_criteria}
                                                    onChange={e => setFormData({ ...formData, measurement_criteria: e.target.value })}
                                                    placeholder="e.g., Attendance logs, Certificates"
                                                    className="border-gray-300 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Justification <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                required
                                                value={formData.justification}
                                                onChange={e => setFormData({ ...formData, justification: e.target.value })}
                                                placeholder="Explain how this aligns with department goals..."
                                                className="border-gray-300 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="flex flex-row justify-end items-center gap-4 pt-6 border-t border-gray-200 mt-6 pb-2">
                                            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-gray-700 border-gray-300 hover:bg-gray-100">
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] py-2">
                                                {submitting ? (
                                                    <>Submitting...</>
                                                ) : (
                                                    <><Send className="w-4 h-4 mr-2" /> Submit KPI</>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Requests List */}
                        <div id="requests-table" className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
                            <Card className="shadow-sm">
                                <CardContent className="p-0">
                                    {loading ? (
                                        <div className="text-center py-12 text-gray-500">Loading requests...</div>
                                    ) : requests.length === 0 ? (
                                        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200 m-4">
                                            <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm">
                                                <Target className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No KPI requests found</h3>
                                            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                                                You haven't submitted any KPI requests yet. Click the "Create New KPI" button to get started.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-gray-50">
                                                    <TableRow>
                                                        <TableHead className="font-semibold text-gray-700">KPI Title</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Category</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Submitted</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Feedback</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {requests.map((req) => (
                                                        <TableRow key={req.id} className="hover:bg-gray-50 transition-colors">
                                                            <TableCell className="font-medium text-gray-900">{req.kpi_title}</TableCell>
                                                            <TableCell>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                                    {req.category}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-gray-500">{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                                            <TableCell>{getStatusBadge(req.status)}</TableCell>
                                                            <TableCell className="text-gray-500 italic max-w-xs truncate">
                                                                {req.principal_comments || '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
