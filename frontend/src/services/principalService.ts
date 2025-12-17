import api from './api';

export interface DashboardStats {
    stats: {
        total_teachers: number;
        average_kpi: number;
        pending_evaluations: number;
        pending_reevaluations: number;
    };
    top_performers: Array<{
        id: number;
        full_name: string;
        department?: {
            name: string;
        };
        final_weighted_score: number;
    }>;
    recent_reevaluations: Array<{
        id: number;
        teacher: {
            full_name: string;
        };
        reason: string;
        status: string;
        created_at: string;
    }>;
}

export const principalService = {
    getDashboardStats: async (year?: number) => {
        const query = year ? `?year=${year}` : '';
        const response = await api.get<DashboardStats>(`/principal/dashboard-stats${query}`);
        return response.data;
    },
};
