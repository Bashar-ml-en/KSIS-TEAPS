import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { FileDown, Loader2, TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { View } from '../../App';
import { toast } from 'sonner';
import reportService, { SchoolReport, DepartmentReport } from '../../services/reportService';
import teacherService from '../../services/teacherService';

interface EnhancedReportScreenProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'principal' | 'teacher' | 'admin';
}

export function EnhancedReportScreen({ onNavigate, onLogout, userName, userRole }: EnhancedReportScreenProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [schoolReport, setSchoolReport] = useState<SchoolReport | null>(null);
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadReports();
    }, [selectedYear]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const [school, depts] = await Promise.all([
                reportService.getSchoolReport(selectedYear),
                teacherService.getDepartments(),
            ]);

            setSchoolReport(school);
            console.log(school);
            setDepartments(depts);
        } catch (error: any) {
            console.error('Failed to load reports:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const blob = await reportService.exportReport('school', undefined, selectedYear);
            reportService.downloadReport(blob, `school_report_${selectedYear}.csv`);
            toast.success('Report exported successfully!');
        } catch (error: any) {
            console.error('Failed to export report:', error);
            toast.error('Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="reports"
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
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                                Performance Reports
                            </h1>
                            <p className="text-gray-600 mt-1">Comprehensive analysis of school performance</p>
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
                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
                                ) : (
                                    <><FileDown className="w-4 h-4" /> Export Report</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Teachers</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {schoolReport?.total_teachers || 0}
                                    </p>
                                </div>
                                <Users className="w-12 h-12 text-blue-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Departments</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {schoolReport?.total_departments || 0}
                                    </p>
                                </div>
                                <BookOpen className="w-12 h-12 text-green-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Average Score</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {schoolReport?.overall_performance?.average_score?.toFixed(1) || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
                                </div>
                                <Award className="w-12 h-12 text-purple-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">KPI Completion</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {schoolReport?.kpi_summary?.completion_rate?.toFixed(0) || 0}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {schoolReport?.kpi_summary?.total_kpis || 0} total KPIs
                                    </p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-orange-600 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Department Rankings */}
                    {schoolReport?.department_rankings && schoolReport.department_rankings.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Rankings</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rank</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Department</th>
                                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Average Score</th>
                                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schoolReport.department_rankings.map((dept) => (
                                            <tr key={dept.rank} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${dept.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                            dept.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                                                dept.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-gray-50 text-gray-600'
                                                        } font-semibold`}>
                                                        {dept.rank}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-900 font-medium">{dept.department}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-lg font-semibold text-blue-600">
                                                        {dept.average_score.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${(dept.average_score / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* CPE Compliance */}
                    {schoolReport?.cpe_compliance && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">CPE Compliance</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Compliant Teachers</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        {schoolReport.cpe_compliance.compliant_teachers}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Compliance Rate</p>
                                    <p className="text-4xl font-bold text-blue-600">
                                        {schoolReport.cpe_compliance.compliance_rate.toFixed(0)}%
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Total Teachers</p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {schoolReport.total_teachers}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-green-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${schoolReport.cpe_compliance.compliance_rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
