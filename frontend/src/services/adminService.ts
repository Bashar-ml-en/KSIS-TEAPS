import api from './api';

export interface AdminDashboardStats {
    stats: {
        total_users: number;
        active_evaluations: number;
        total_teachers: number;
        system_status: string;
    };
    recent_users: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: string;
    }>;
}

export const adminService = {
    getDashboardStats: async () => {
        const response = await api.get<AdminDashboardStats>('/hr-admin/dashboard-stats');
        return response.data;
    }
};
