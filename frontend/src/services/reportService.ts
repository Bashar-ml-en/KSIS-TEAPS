import api from './api';

export interface TeacherReport {
    type: 'individual';
    generated_at: string;
    year: number;
    teacher: {
        id: number;
        name: string;
        employee_id: string;
        department: string;
        position: string;
    };
    performance: {
        final_score: number | null;
        rating: string;
        breakdown: {
            part_2_score: number;
            part_3_score: number;
            cpe_score: number;
        };
        status: string;
    } | null;
    cpe_summary: {
        total_hours: number;
        total_points: number;
        compliant: boolean;
    };
}

export interface DepartmentReport {
    type: 'department';
    generated_at: string;
    year: number;
    department: {
        id: number;
        name: string;
        head_of_department: string | null;
        total_teachers: number;
    };
    statistics: {
        average_score: number;
        highest_score: number;
        lowest_score: number;
        completed_appraisals: number;
    };
    rating_distribution: Record<string, number>;
    teacher_performance_list: Array<{
        teacher_name: string;
        score: number | null;
        rating: string;
    }>;
}

export interface SchoolReport {
    type: 'school';
    generated_at: string;
    year: number;
    statistics: {
        total_teachers: number;
        total_appraisals: number;
        average_score: number;
    };
    rating_distribution: Record<string, number>;
    department_performance: Array<{
        name: string;
        average_score: number;
        count: number;
    }>;
}

export const reportService = {
    getTeacherReport: async (teacherId: number, year?: number) => {
        const query = year ? `?year=${year}` : '';
        const response = await api.get<TeacherReport>(`/reports/teacher/${teacherId}${query}`);
        return response.data;
    },

    getDepartmentReport: async (departmentId: number, year?: number) => {
        const query = year ? `?year=${year}` : '';
        const response = await api.get<DepartmentReport>(`/reports/department/${departmentId}${query}`);
        return response.data;
    },

    getSchoolReport: async (year?: number) => {
        const query = year ? `?year=${year}` : '';
        const response = await api.get<SchoolReport>(`/reports/school${query}`);
        return response.data;
    },

    exportReport: async (type: 'individual' | 'department' | 'school', id?: number, year?: number) => {
        let url = `/reports/export?type=${type}`;
        if (id) url += `&id=${id}`;
        if (year) url += `&year=${year}`;

        const response = await api.get(url, { responseType: 'blob' });
        return response.data;
    }
};
