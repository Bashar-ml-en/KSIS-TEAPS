import api from './api';

export interface KPI {
    id: number;
    teacher_id: number;
    title: string;
    description: string;
    target_value: number;
    current_value: number;
    progress_percentage: number;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    due_date: string;
    created_at: string;
    updated_at: string;
}

export interface CreateKPIData {
    teacher_id: number;
    title: string;
    description: string;
    target_value: number;
    due_date: string;
}

export interface UpdateProgressData {
    current_value: number;
    notes?: string;
}

class KPIService {
    /**
     * Get all KPIs (for HR/Principal)
     */
    async getAll(): Promise<KPI[]> {
        const response = await api.get<{ kpis: KPI[] }>('/kpis');
        return response.data.kpis;
    }

    /**
     * Get KPIs for a specific teacher
     */
    async getByTeacher(teacherId: number): Promise<KPI[]> {
        const response = await api.get<{ kpis: KPI[] }>(`/teachers/${teacherId}/kpis`);
        return response.data.kpis;
    }

    /**
     * Get a single KPI by ID
     */
    async getById(id: number): Promise<KPI> {
        const response = await api.get<{ kpi: KPI }>(`/kpis/${id}`);
        return response.data.kpi;
    }

    /**
     * Create a new KPI
     */
    async create(data: CreateKPIData): Promise<KPI> {
        const response = await api.post<{ kpi: KPI }>('/kpis', data);
        return response.data.kpi;
    }

    /**
     * Update a KPI
     */
    async update(id: number, data: Partial<CreateKPIData>): Promise<KPI> {
        const response = await api.put<{ kpi: KPI }>(`/kpis/${id}`, data);
        return response.data.kpi;
    }

    /**
     * Update KPI progress
     */
    async updateProgress(id: number, data: UpdateProgressData): Promise<KPI> {
        const response = await api.post<{ kpi: KPI }>(`/kpis/${id}/progress`, data);
        return response.data.kpi;
    }

    /**
     * Delete a KPI
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/kpis/${id}`);
    }
}

export const kpiService = new KPIService();
export default kpiService;
