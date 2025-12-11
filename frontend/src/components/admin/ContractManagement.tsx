import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { FileText, Plus, Search, Calendar, User, Download, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Contract {
    id: number;
    teacher_id: number;
    teacher: {
        id: number;
        full_name: string;
        employee_id: string;
    };
    start_date: string;
    end_date: string | null;
    type: 'permanent' | 'contract' | 'probation' | 'part_time';
    status: 'active' | 'expired' | 'terminated' | 'pending_renewal';
    notes?: string;
}

interface Teacher {
    id: number;
    full_name: string;
    employee_id: string;
}

interface ContractManagementProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'admin';
}

export function ContractManagement({ onNavigate, onLogout, userName, userRole }: ContractManagementProps) {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAddContractOpen, setIsAddContractOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // New Contract State
    const [newContract, setNewContract] = useState({
        teacher_id: '',
        type: 'contract',
        start_date: '',
        end_date: '',
        status: 'active',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [contractsRes, teachersRes] = await Promise.all([
                api.get('/contracts'),
                api.get('/teachers')
            ]);

            setContracts(contractsRes.data.data || contractsRes.data);
            setTeachers(teachersRes.data.data || teachersRes.data);
        } catch (error: any) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load contracts data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContract = async () => {
        if (!newContract.teacher_id || !newContract.start_date || !newContract.type) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/contracts', newContract);
            toast.success('Contract created successfully');
            setIsAddContractOpen(false);
            setNewContract({
                teacher_id: '',
                type: 'contract',
                start_date: '',
                end_date: '',
                status: 'active',
                notes: ''
            });
            loadData();
        } catch (error: any) {
            console.error('Failed to create contract:', error);
            toast.error(error.response?.data?.message || 'Failed to create contract');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch =
            contract.teacher?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.teacher?.employee_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'expired': return 'bg-red-100 text-red-800 border-red-200';
            case 'pending_renewal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'terminated': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type: string) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="admin-contracts"
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
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-8 h-8 text-blue-600" />
                                Contract Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage teacher contracts and renewals</p>
                        </div>
                        <Button
                            onClick={() => setIsAddContractOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Contract
                        </Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Contracts</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{contracts.length}</h3>
                                </div>
                                <FileText className="w-8 h-8 text-blue-500 opacity-20" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active</p>
                                    <h3 className="text-2xl font-bold text-green-600">
                                        {contracts.filter(c => c.status === 'active').length}
                                    </h3>
                                </div>
                                <FileCheck className="w-8 h-8 text-green-500 opacity-20" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                                    <h3 className="text-2xl font-bold text-yellow-600">
                                        {contracts.filter(c => {
                                            if (!c.end_date || c.status !== 'active') return false;
                                            const days = Math.ceil((new Date(c.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                            return days > 0 && days <= 60;
                                        }).length}
                                    </h3>
                                </div>
                                <AlertCircle className="w-8 h-8 text-yellow-500 opacity-20" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Renewal</p>
                                    <h3 className="text-2xl font-bold text-orange-600">
                                        {contracts.filter(c => c.status === 'pending_renewal').length}
                                    </h3>
                                </div>
                                <History className="w-8 h-8 text-orange-500 opacity-20" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by teacher name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                                <SelectItem value="terminated">Terminated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Contracts List */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : filteredContracts.length === 0 ? (
                            <div className="text-center p-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">No contracts found</h3>
                                <p className="text-gray-500">Get started by creating a new contract.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Teacher</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Duration</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredContracts.map((contract) => (
                                            <tr key={contract.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{contract.teacher?.full_name}</div>
                                                    <div className="text-xs text-gray-500">{contract.teacher?.employee_id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="capitalize">
                                                        {getTypeLabel(contract.type)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900">
                                                            {new Date(contract.start_date).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">
                                                            to {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Indefinite'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                                                        {getTypeLabel(contract.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Download</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>

                <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Contract</DialogTitle>
                            <DialogDescription>Add a new employment contract for a teacher.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="teacher">Teacher</Label>
                                <Select
                                    value={newContract.teacher_id}
                                    onValueChange={(val) => setNewContract({ ...newContract, teacher_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map(t => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {t.full_name} ({t.employee_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Contract Type</Label>
                                    <Select
                                        value={newContract.type}
                                        onValueChange={(val) => setNewContract({ ...newContract, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="permanent">Permanent</SelectItem>
                                            <SelectItem value="contract">Fixed Term</SelectItem>
                                            <SelectItem value="probation">Probation</SelectItem>
                                            <SelectItem value="part_time">Part Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={newContract.status}
                                        onValueChange={(val) => setNewContract({ ...newContract, status: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={newContract.start_date}
                                        onChange={(e) => setNewContract({ ...newContract, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={newContract.end_date}
                                        onChange={(e) => setNewContract({ ...newContract, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={newContract.notes}
                                    onChange={(e) => setNewContract({ ...newContract, notes: e.target.value })}
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddContractOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateContract} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                                ) : (
                                    'Create Contract'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
