import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { BookOpen, Plus, Check, X, Loader2, Award, AlertCircle, Calendar, Clock } from 'lucide-react';
import { View } from '../../App';
import { toast } from 'sonner';
import cpeService, { MyCPERecord, CPECompliance } from '../../services/cpeService';

interface CPEManagementProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'principal' | 'teacher' | 'admin';
}

export function CPEManagement({ onNavigate, onLogout, userName, userRole }: CPEManagementProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<MyCPERecord[]>([]);
    const [compliance, setCompliance] = useState<CPECompliance | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [formData, setFormData] = useState({
        activity_type: 'workshop' as MyCPERecord['activity_type'],
        title: '',
        description: '',
        organizer: '',
        start_date: '',
        end_date: '',
        hours: 0,
    });

    useEffect(() => {
        loadData();
    }, [selectedYear]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [recordsData, complianceData] = await Promise.all([
                cpeService.getCPERecords(),
                cpeService.getMyCompliance(selectedYear),
            ]);

            setRecords(recordsData.data);
            setCompliance(complianceData);
        } catch (error: any) {
            console.error('Failed to load CPE data:', error);
            toast.error('Failed to load CPE records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await cpeService.createCPERecord(formData);
            toast.success('CPE record added successfully!');
            setShowAddForm(false);
            setFormData({
                activity_type: 'workshop',
                title: '',
                description: '',
                organizer: '',
                start_date: '',
                end_date: '',
                hours: 0,
            });
            loadData();
        } catch (error: any) {
            console.error('Failed to create CPE record:', error);
            toast.error(error.response?.data?.message || 'Failed to add CPE record');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this CPE record?')) return;

        try {
            await cpeService.deleteCPERecord(id);
            toast.success('CPE record deleted');
            loadData();
        } catch (error: any) {
            console.error('Failed to delete CPE record:', error);
            toast.error('Failed to delete CPE record');
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await cpeService.approveCPERecord(id);
            toast.success('CPE record approved');
            loadData();
        } catch (error: any) {
            console.error('Failed to approve CPE record:', error);
            toast.error('Failed to approve CPE record');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading CPE records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="attendance"
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
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                CPE Management
                            </h1>
                            <p className="text-gray-600 mt-1">Continuing Professional Education Records</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {[2024, 2023, 2022, 2021].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {userRole === 'teacher' && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add CPE Record
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Compliance Summary */}
                    {compliance && (
                        <div className={`mb-6 rounded-lg p-6 ${compliance.compliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                            }`}>
                            <div className="flex items-start gap-4">
                                {compliance.compliant ? (
                                    <Award className="w-12 h-12 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {compliance.compliant ? '✅ Compliant' : '⚠️ Non-Compliant'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Hours</p>
                                            <p className="text-2xl font-bold text-gray-900">{compliance.total_hours}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Required Hours</p>
                                            <p className="text-2xl font-bold text-gray-900">{compliance.required_hours}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {compliance.compliant ? 'Excess Hours' : 'Shortage'}
                                            </p>
                                            <p className={`text-2xl font-bold ${compliance.compliant ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.abs(compliance.shortage)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-500 ${compliance.compliant ? 'bg-green-600' : 'bg-red-600'
                                                    }`}
                                                style={{ width: `${Math.min((compliance.total_hours / compliance.required_hours) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Form Modal */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Add CPE Record</h2>
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Activity Type
                                            </label>
                                            <select
                                                value={formData.activity_type}
                                                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as MyCPERecord['activity_type'] })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="workshop">Workshop</option>
                                                <option value="seminar">Seminar</option>
                                                <option value="conference">Conference</option>
                                                <option value="course">Course</option>
                                                <option value="webinar">Webinar</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Organizer
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.organizer}
                                                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.start_date}
                                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.end_date}
                                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Hours
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={formData.hours}
                                                onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Add Record
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Records List */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {records.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No CPE records found</p>
                                {userRole === 'teacher' && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="mt-4 text-blue-600 hover:text-blue-800"
                                    >
                                        Add your first CPE record
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Activity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Dates
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hours
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{record.title}</div>
                                                    <div className="text-sm text-gray-500">{record.organizer}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {cpeService.getActivityTypeLabel(record.activity_type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(record.start_date).toLocaleDateString()} -
                                                        {new Date(record.end_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-semibold text-gray-900">{record.hours}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cpeService.getStatusBgColor(record.status)} ${cpeService.getStatusColor(record.status)}`}>
                                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {(userRole === 'principal' || userRole === 'admin') && record.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleApprove(record.id)}
                                                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {userRole === 'teacher' && record.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleDelete(record.id)}
                                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                                                title="Delete"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
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
            </div>
        </div>
    );
}
