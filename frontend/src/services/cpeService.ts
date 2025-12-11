import api from './api';

export interface MyCPERecord {
    id: number;
    teacher_id: number;
    teacher_name?: string;
    activity_type: 'workshop' | 'seminar' | 'conference' | 'course' | 'webinar' | 'other';
    title: string;
    description?: string;
    organizer: string;
    start_date: string;
    end_date: string;
    hours: number;
    certificate_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: number;
    approved_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}

export interface CPECompliance {
    teacher_id: number;
    teacher_name: string;
    year: number;
    total_hours: number;
    required_hours: number;
    compliant: boolean;
    shortage: number;
    records: MyCPERecord[];
}

export interface CPEListResponse {
    data: MyCPERecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

class CPEService {
    /**
     * Get all CPE records (paginated)
     */
    async getCPERecords(page: number = 1, perPage: number = 20): Promise<CPEListResponse> {
        try {
            const response = await api.get<CPEListResponse>('/mycpe-records', {
                params: { page, per_page: perPage },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get CPE records:', error);
            throw error;
        }
    }

    /**
     * Get single CPE record
     */
    async getCPERecord(id: number): Promise<MyCPERecord> {
        try {
            const response = await api.get<{ record: MyCPERecord }>(`/mycpe-records/${id}`);
            return response.data.record;
        } catch (error) {
            console.error('Failed to get CPE record:', error);
            throw error;
        }
    }

    /**
     * Create new CPE record
     */
    async createCPERecord(data: Partial<MyCPERecord>): Promise<MyCPERecord> {
        try {
            const response = await api.post<{ record: MyCPERecord }>('/mycpe-records', data);
            return response.data.record;
        } catch (error) {
            console.error('Failed to create CPE record:', error);
            throw error;
        }
    }

    /**
     * Update CPE record
     */
    async updateCPERecord(id: number, data: Partial<MyCPERecord>): Promise<MyCPERecord> {
        try {
            const response = await api.put<{ record: MyCPERecord }>(`/mycpe-records/${id}`, data);
            return response.data.record;
        } catch (error) {
            console.error('Failed to update CPE record:', error);
            throw error;
        }
    }

    /**
     * Delete CPE record
     */
    async deleteCPERecord(id: number): Promise<void> {
        try {
            await api.delete(`/mycpe-records/${id}`);
        } catch (error) {
            console.error('Failed to delete CPE record:', error);
            throw error;
        }
    }

    /**
     * Approve CPE record (Principal/Admin only)
     */
    async approveCPERecord(id: number): Promise<MyCPERecord> {
        try {
            const response = await api.post<{ message: string; record: MyCPERecord }>(
                `/mycpe-records/${id}/approve`
            );
            return response.data.record;
        } catch (error) {
            console.error('Failed to approve CPE record:', error);
            throw error;
        }
    }

    /**
     * Get CPE compliance for current user
     */
    async getMyCompliance(year?: number): Promise<CPECompliance> {
        try {
            const params = year ? { year } : {};
            const response = await api.get<CPECompliance>('/mycpe-records/compliance/check', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get CPE compliance:', error);
            throw error;
        }
    }

    /**
     * Get CPE compliance for all teachers (Admin/Principal only)
     */
    async getBulkCompliance(year?: number): Promise<{
        summary: {
            total_teachers: number;
            compliant: number;
            non_compliant: number;
            compliance_rate: number;
        };
        non_compliant_teachers: Array<{
            id: number;
            name: string;
            cpe_hours: number;
            required_hours: number;
            shortage: number;
        }>;
    }> {
        try {
            const params = year ? { year } : {};
            const response = await api.get('/mycpe-records/bulk-compliance', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get bulk compliance:', error);
            throw error;
        }
    }

    /**
     * Get activity type label
     */
    getActivityTypeLabel(type: MyCPERecord['activity_type']): string {
        const labels = {
            workshop: 'Workshop',
            seminar: 'Seminar',
            conference: 'Conference',
            course: 'Course',
            webinar: 'Webinar',
            other: 'Other',
        };
        return labels[type] || type;
    }

    /**
     * Get status color
     */
    getStatusColor(status: MyCPERecord['status']): string {
        const colors = {
            pending: 'text-yellow-600',
            approved: 'text-green-600',
            rejected: 'text-red-600',
        };
        return colors[status] || 'text-gray-600';
    }

    /**
     * Get status background color
     */
    getStatusBgColor(status: MyCPERecord['status']): string {
        const colors = {
            pending: 'bg-yellow-100',
            approved: 'bg-green-100',
            rejected: 'bg-red-100',
        };
        return colors[status] || 'bg-gray-100';
    }
}

export default new CPEService();
