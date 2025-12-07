import api from './api';

export interface TeacherReport {
    teacher: {
        id: number;
        name: string;
        email: string;
        department: string;
    };
    year: number;
    kpi_summary: {
        total_kpis: number;
        completed: number;
        in_progress: number;
        not_started: number;
        average_progress: number;
    };
    evaluation_summary: {
        total_evaluations: number;
        average_score: number;
        highest_score: number;
        lowest_score: number;
    };
    observations: {
        total: number;
        average_rating: number;
    };
    cpe_compliance: {
        total_hours: number;
        required_hours: number;
        compliant: boolean;
    };
}

export interface DepartmentReport {
    department: {
        id: number;
        name: string;
    };
    year: number;
    teacher_count: number;
    performance_summary: {
        average_score: number;
        top_performers: number;
        needs_improvement: number;
    };
    kpi_summary: {
        total_kpis: number;
        completion_rate: number;
    };
    cpe_compliance: {
        compliant_teachers: number;
        non_compliant_teachers: number;
        compliance_rate: number;
    };
}

export interface SchoolReport {
    year: number;
    total_teachers: number;
    total_departments: number;
    overall_performance: {
        average_score: number;
        total_evaluations: number;
    };
    kpi_summary: {
        total_kpis: number;
        completion_rate: number;
    };
    cpe_compliance: {
        compliant_teachers: number;
        compliance_rate: number;
    };
    department_rankings: Array<{
        department: string;
        average_score: number;
        rank: number;
    }>;
}

export interface TrainingDashboard {
    year: number;
    summary: {
        total_teachers: number;
        compliant: number;
        non_compliant: number;
        compliance_rate: number;
        total_cpe_hours: number;
        average_cpe_hours: number;
    };
    department_breakdown: Array<{
        department: string;
        total_teachers: number;
        compliant: number;
        compliance_rate: number;
        average_hours: number;
    }>;
    non_compliant_teachers: Array<{
        id: number;
        name: string;
        department: string;
        cpe_hours: number;
        required_hours: number;
        shortage: number;
    }>;
}

class ReportService {
    /**
     * Get teacher performance report
     */
    async getTeacherReport(teacherId: number, year?: number): Promise<TeacherReport> {
        try {
            const params = year ? { year } : {};
            const response = await api.get<TeacherReport>(`/reports/teacher/${teacherId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get teacher report:', error);
            throw error;
        }
    }

    /**
     * Get department report
     */
    async getDepartmentReport(departmentId: number, year?: number): Promise<DepartmentReport> {
        try {
            const params = year ? { year } : {};
            const response = await api.get<DepartmentReport>(`/reports/department/${departmentId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get department report:', error);
            throw error;
        }
    }

    /**
     * Get school-wide report
     */
    async getSchoolReport(year?: number): Promise<SchoolReport> {
        try {
            const params = year ? { year } : {};
            const response = await api.get<SchoolReport>('/reports/school', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get school report:', error);
            throw error;
        }
    }

    /**
     * Get training dashboard data
     */
    async getTrainingDashboard(year?: number): Promise<TrainingDashboard> {
        try {
            const params = year ? { year } : {};
            const response = await api.get<TrainingDashboard>('/reports/training-dashboard', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get training dashboard:', error);
            throw error;
        }
    }

    /**
     * Export report to CSV
     */
    async exportReport(type: 'individual' | 'department' | 'school', id?: number, year?: number): Promise<Blob> {
        try {
            const params: any = { type };
            if (id) params.id = id;
            if (year) params.year = year;

            const response = await api.get('/reports/export', {
                params,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Failed to export report:', error);
            throw error;
        }
    }

    /**
     * Download exported report
     */
    downloadReport(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

export default new ReportService();
