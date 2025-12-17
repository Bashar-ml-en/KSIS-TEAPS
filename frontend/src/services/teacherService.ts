import api from './api';

export interface DashboardStats {
    total_evaluations: number;
    average_score: number;
    pending_kpi_requests: number;
    kpi_approval_rate: number;
    attendance_rate: number;
    total_kpi_requests: number;
}

export interface Submission {
    id: number;
    teacher: string;
    subject: string;
    date: string;
    rating: number;
}

export const teacherService = {
    getDashboardStats: async () => {
        const response = await api.get<DashboardStats>('/teacher/dashboard-stats');
        return response.data;
    },
    getRecentSubmissions: async () => {
        const response = await api.get<Submission[]>('/teacher/recent-submissions');
        return response.data;
    }
}
