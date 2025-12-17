import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Loader2 } from 'lucide-react';
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
    teacher_id: number;
    teacher?: {
        full_name: string;
        employee_id: string;
    };
    kpi_title: string;
    kpi_description: string;
    category: string;
    justification: string;
    target_value: string;
    measurement_criteria: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export function KPIApproval({ onNavigate, onLogout, userName, userRole }: KPIApprovalProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState<KPIRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Approval/Rejection Dialog State
    const [selectedRequest, setSelectedRequest] = useState<KPIRequestItem | null>(null);
    const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);
    const [comments, setComments] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // Fetch all KPI requests. Backend should filter by authorization or return all for Principal
            // Ideally, backend filters to only show requests for teachers in Principal's school/department
            const response = await api.get('/kpi-requests');
            setRequests(response.data.data || response.data);
        } catch (error: any) {
            console.error('Failed to load KPI requests:', error);
            // Fallback for mocked environment if needed, or just show error
            toast.error('Failed to load KPI requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionDialog) return;

        setProcessing(true);
        try {
            const endpoint = `/kpi-requests/${selectedRequest.id}/${actionDialog}`;
            await api.post(endpoint, {
                comments: comments
            });

            toast.success(`KPI Request ${actionDialog}d successfully`);

            // Remove from list or update status
            setRequests(prev => prev.map(req =>
                req.id === selectedRequest.id
                    ? { ...req, status: actionDialog === 'approve' ? 'approved' : 'rejected' }
                    : req
            ));

            closeDialog();
        } catch (error: any) {
            console.error(`Failed to ${actionDialog} request:`, error);
            toast.error(error.response?.data?.message || `Failed to ${actionDialog} request`);
        } finally {
            setProcessing(false);
        }
    };

    const closeDialog = () => {
        setActionDialog(null);
        setSelectedRequest(null);
        setComments('');
    };

    const openDialog = (req: KPIRequestItem, action: 'approve' | 'reject') => {
        setSelectedRequest(req);
        setActionDialog(action);
        setComments(''); // Reset comments
    };

    const filteredRequests = requests.filter(req => {
        // Only show pending requests in the main list, or allow filtering?
        // Let's show all but allow filtering. Or strictly waiting for approval first.
        // Usually review pages focus on 'pending'.

        const matchesSearch =
            (req.teacher?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.kpi_title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
    const historyRequests = filteredRequests.filter(r => r.status !== 'pending');

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="principal-kpi-requests" // This must match Sidebar item view
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

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">KPI Approvals</h1>
                                <p className="text-gray-600 mt-1">Review and approve KPI requests from teachers</p>
                            </div>
                        </div>

                        {/* Stats / Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white shadow-sm border-l-4 border-l-yellow-500">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Pending Review</p>
                                            <h3 className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</h3>
                                        </div>
                                        <Clock className="w-8 h-8 text-yellow-100" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Approved (Total)</p>
                                            <h3 className="text-2xl font-bold text-green-600">
                                                {requests.filter(r => r.status === 'approved').length}
                                            </h3>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-green-100" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Rejected (Total)</p>
                                            <h3 className="text-2xl font-bold text-red-600">
                                                {requests.filter(r => r.status === 'rejected').length}
                                            </h3>
                                        </div>
                                        <XCircle className="w-8 h-8 text-red-100" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by teacher or KPI title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Pending Requests */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pending Requests</h2>
                            {loading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                    <p className="text-gray-500 mt-2">Loading requests...</p>
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
                                    <CheckCircle className="w-10 h-10 text-green-200 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">All caught up! No pending requests.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {pendingRequests.map(req => (
                                        <Card key={req.id} className="bg-white hover:shadow-md transition-shadow duration-200">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                            <span className="text-sm font-medium text-blue-600">{req.category}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(req.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900">{req.kpi_title}</h3>
                                                        <p className="text-sm text-gray-600">{req.kpi_description}</p>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                                            <div>
                                                                <h4 className="text-xs font-semibold uppercase text-gray-400">Teacher</h4>
                                                                <p className="text-sm font-medium text-gray-900">{req.teacher?.full_name || 'Unknown Teacher'}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-semibold uppercase text-gray-400">Target & Criteria</h4>
                                                                <p className="text-sm text-gray-700">{req.target_value} ({req.measurement_criteria})</p>
                                                            </div>
                                                            <div className="sm:col-span-2">
                                                                <h4 className="text-xs font-semibold uppercase text-gray-400">Justification</h4>
                                                                <p className="text-sm text-gray-700 italic">{req.justification}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col gap-2 justify-start md:justify-center min-w-[120px]">
                                                        <Button
                                                            className="bg-green-600 hover:bg-green-700 text-white w-full"
                                                            onClick={() => openDialog(req, 'approve')}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                                                            onClick={() => openDialog(req, 'reject')}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent History */}
                        {historyRequests.length > 0 && (
                            <div className="space-y-4 pt-8 border-t">
                                <h2 className="text-lg font-semibold text-gray-900">Recent History</h2>
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>KPI</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {historyRequests.slice(0, 10).map(req => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">{req.teacher?.full_name}</TableCell>
                                                    <TableCell>{req.kpi_title}</TableCell>
                                                    <TableCell>
                                                        {req.status === 'approved' ? (
                                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                                        ) : (
                                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500">{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Approve/Reject Dialog */}
                <Dialog open={!!actionDialog} onOpenChange={() => closeDialog()}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {actionDialog === 'approve' ? 'Approve KPI Request' : 'Reject KPI Request'}
                            </DialogTitle>
                            <DialogDescription>
                                {actionDialog === 'approve'
                                    ? 'Confirm approval for this KPI. This will make it active for the teacher.'
                                    : 'Please provide a reason for rejection. The teacher will be notified to revise.'
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Teacher</Label>
                                <div className="p-2 bg-gray-50 rounded border text-sm">{selectedRequest?.teacher?.full_name}</div>
                            </div>
                            <div className="space-y-2">
                                <Label>KPI Title</Label>
                                <div className="p-2 bg-gray-50 rounded border text-sm">{selectedRequest?.kpi_title}</div>
                            </div>
                            <div className="space-y-2">
                                <Label>Comments (Optional)</Label>
                                <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder={actionDialog === 'approve' ? "Good goal..." : "Please clarify..."}
                                    className="h-24"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog} disabled={processing}>Cancel</Button>
                            <Button
                                onClick={handleAction}
                                disabled={processing}
                                className={actionDialog === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700 text-white'}
                            >
                                {processing ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                                ) : (
                                    <>{actionDialog === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}</>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
