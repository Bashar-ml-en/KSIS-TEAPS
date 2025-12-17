import { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, User } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';
import backgroundImage from '../../assets/aiuis-bg.jpg';

interface PrincipalKPIRequestsProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName?: string;
    userRole: 'principal';
}

interface KPIRequest {
    id: number;
    teacher_id: number;
    teacher_name: string; // This might need to be fetched via relationship 'teacher.user.name' or similar
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export function PrincipalKPIRequests({ onNavigate, onLogout, userName, userRole }: PrincipalKPIRequestsProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState<KPIRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Assuming GET /api/kpi-requests returns the list
            // The backend controller should filter this based on role?
            // Or we might need to filter manually if the endpoint returns *my* requests vs *all* requests.
            // Usually index() for Principal returns all requests they need to review?
            // Let's check KpiRequestController later if needed. For now assume it returns list.
            const response = await api.get('/kpi-requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch KPI requests:', error);
            toast.error('Failed to load KPI requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.post(`/kpi-requests/${id}/approve`);
            toast.success('KPI Request approved successfully');
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error('Failed to approve request:', error);
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async (id: number) => {
        try {
            // You might want to add a reason for rejection here via a modal, 
            // but for now let's just do the action.
            await api.post(`/kpi-requests/${id}/reject`);
            toast.success('KPI Request rejected');
            fetchRequests();
        } catch (error) {
            console.error('Failed to reject request:', error);
            toast.error('Failed to reject request');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>;
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
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />

            <div className="relative z-10 flex h-screen overflow-hidden w-full">
                <Sidebar
                    role={userRole}
                    currentView="principal-kpi-requests"
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header
                        title="KPI Requests Management"
                        userName={userName}
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Pending Requests</h1>
                                <p className="text-gray-500">Review and manage teacher KPI proposals</p>
                            </div>
                            <Button variant="outline" onClick={fetchRequests} className="gap-2">
                                <Clock className="w-4 h-4" /> Refresh
                            </Button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : requests.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                                    <FileText className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No KPI requests found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {requests.map((request: any) => (
                                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getStatusBadge(request.status)}
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(request.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                                                    <p className="text-gray-600 mb-3">{request.description}</p>

                                                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md w-fit">
                                                        <User className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            {request.teacher?.full_name || 'Unknown Teacher'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {request.status === 'pending' && (
                                                    <div className="flex items-start gap-2">
                                                        <Button
                                                            onClick={() => handleApprove(request.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleReject(request.id)}
                                                            variant="destructive"
                                                            className="gap-2"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
