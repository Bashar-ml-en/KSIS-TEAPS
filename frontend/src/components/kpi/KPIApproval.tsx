import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

interface KPIApprovalProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'principal';
}

interface KPIRequestItem {
    id: number;
    kpi_title: string;
    kpi_description: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    teacher?: {
        name: string;
        department?: {
            name: string;
        }
    };
    justification: string;
}

export function KPIApproval({ onNavigate, onLogout, userName, userRole }: KPIApprovalProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState<KPIRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Fetch all requests. Filter client-side or assume backend filters by Principal's Dept?
            // Usually API returns what the user is allowed to see.
            const response = await api.get('/kpi-requests');
            // Filter for PENDING only generally, but user might want history.
            // Let's show all but sort pending first.
            const allRequests = response.data.data || response.data;
            setRequests(allRequests);
        } catch (error) {
            console.error('Failed to load KPI requests:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            await api.post(`/kpi-requests/${id}/${action}`, {
                principal_comments: action === 'approve' ? 'Approved by Principal' : 'Rejected'
            });
            toast.success(`KPI Request ${action}d successfully`);
            loadData(); // Refresh
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
            toast.error(`Failed to ${action} request`);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="kpi-approval"
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
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">KPI Approvals</h1>
                                <p className="text-gray-600">Review and approve Teacher KPI requests</p>
                            </div>

                        </div>

                        <Card>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading requests...</div>
                                ) : requests.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No requests found.</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>KPI Title</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Justification</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.map((req) => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">
                                                        {req.teacher?.name || 'Unknown'}
                                                        <div className="text-xs text-gray-500">{req.teacher?.department?.name}</div>
                                                    </TableCell>
                                                    <TableCell>{req.kpi_title}</TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                                                            {req.category}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate" title={req.justification}>
                                                        {req.justification}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        {req.status === 'pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() => handleAction(req.id, 'reject')}
                                                                    disabled={processingId === req.id}
                                                                >
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    onClick={() => handleAction(req.id, 'approve')}
                                                                    disabled={processingId === req.id}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
