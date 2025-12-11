import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { View } from '../../App';
import api from '../../services/api';
import { toast } from 'sonner';

interface ContractStatusProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'teacher';
}

interface Contract {
    id: number;
    type: string;
    status: string;
    start_date: string;
    end_date: string | null;
    document_path: string | null;
    notes: string | null;
}

export function ContractStatus({ onNavigate, onLogout, userName, userRole }: ContractStatusProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadContract();
    }, []);

    const loadContract = async () => {
        try {
            const response = await api.get('/my-contract');
            setContract(response.data);
        } catch (error: any) {
            console.error('Failed to load contract:', error);
            if (error.response?.status === 404) {
                setError('No active contract found.');
            } else {
                setError('Failed to load contract details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'pending_renewal': return 'bg-yellow-100 text-yellow-800';
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
                currentView="my-contract"
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
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            My Contract Status
                        </h1>

                        {loading ? (
                            <div className="text-center py-12">Loading contract details...</div>
                        ) : error ? (
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="pt-6 text-center text-red-700">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>{error}</p>
                                </CardContent>
                            </Card>
                        ) : contract ? (
                            <Card className="overflow-hidden">
                                <div className="bg-blue-600 p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-1">Current Employment Contract</h2>
                                            <p className="text-blue-100 opacity-90">
                                                {getTypeLabel(contract.type)} Position
                                            </p>
                                        </div>
                                        <Badge className="bg-white text-blue-800 hover:bg-white">
                                            {contract.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Start Date
                                            </label>
                                            <p className="text-lg font-medium">
                                                {new Date(contract.start_date).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> End Date
                                            </label>
                                            <p className="text-lg font-medium">
                                                {contract.end_date
                                                    ? new Date(contract.end_date).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })
                                                    : 'Indefinite'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {contract.notes && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <label className="text-sm font-medium text-gray-500 block mb-2">Notes</label>
                                            <p className="text-gray-700">{contract.notes}</p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            Contract is valid and active
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}
