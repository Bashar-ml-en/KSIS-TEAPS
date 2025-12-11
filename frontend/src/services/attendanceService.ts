import api from './api';

export interface Attendance {
    id: number;
    user_id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: 'present' | 'late' | 'absent' | 'on_leave';
    hours_worked: number;
    created_at: string;
    updated_at: string;
}

export interface LeaveRequest {
    id: number;
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface AttendanceMetrics {
    attendance_rate: number;
    total_days: number;
    present_days: number;
    late_days: number;
    leave_days: number;
}

export const attendanceService = {
    getHistory: async (limit = 10) => {
        const response = await api.get<Attendance[]>(`/attendance?limit=${limit}`);
        return response.data;
    },

    getTodayStatus: async () => {
        const response = await api.get<{ timed_in: boolean, time_in: string | null, time_out: string | null }>('/attendance/status');
        return response.data;
    },

    clockIn: async () => {
        const response = await api.post<Attendance>('/attendance/clock-in');
        return response.data;
    },

    clockOut: async () => {
        const response = await api.post<Attendance>('/attendance/clock-out');
        return response.data;
    },

    getMetrics: async () => {
        const response = await api.get<AttendanceMetrics>('/attendance/metrics');
        return response.data;
    },

    getLeaveRequests: async () => {
        const response = await api.get<LeaveRequest[]>('/leave-requests');
        return response.data;
    },

    requestLeave: async (data: { leave_type: string, start_date: string, end_date: string, reason: string }) => {
        const response = await api.post<LeaveRequest>('/leave-requests', data);
        return response.data;
    },
};
