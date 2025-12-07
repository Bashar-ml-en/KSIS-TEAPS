import api from './api';

export interface Notification {
    id: number;
    user_id: number;
    type: 'evaluation' | 're-evaluation' | 'kpi' | 'cpe' | 'system' | 'general';
    title: string;
    message: string;
    data?: any;
    is_read: boolean;
    read_at?: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationListResponse {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

class NotificationService {
    /**
     * Get all notifications for the current user
     */
    async getNotifications(page: number = 1, perPage: number = 20, isRead?: boolean): Promise<NotificationListResponse> {
        try {
            const params: any = { page, per_page: perPage };
            if (isRead !== undefined) {
                params.is_read = isRead;
            }

            const response = await api.get<NotificationListResponse>('/notifications', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to get notifications:', error);
            throw error;
        }
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        try {
            const response = await api.get<{ unread_count: number }>('/notifications/unread-count');
            return response.data.unread_count;
        } catch (error) {
            console.error('Failed to get unread count:', error);
            throw error;
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: number): Promise<Notification> {
        try {
            const response = await api.post<{ message: string; notification: Notification }>(
                `/notifications/${notificationId}/mark-as-read`
            );
            return response.data.notification;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        try {
            await api.post('/notifications/mark-all-as-read');
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Get notification icon color based on type
     */
    getNotificationColor(type: Notification['type']): string {
        switch (type) {
            case 'evaluation':
                return 'text-blue-600';
            case 're-evaluation':
                return 'text-orange-600';
            case 'kpi':
                return 'text-green-600';
            case 'cpe':
                return 'text-purple-600';
            case 'system':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    }

    /**
     * Get notification background color based on type
     */
    getNotificationBgColor(type: Notification['type']): string {
        switch (type) {
            case 'evaluation':
                return 'bg-blue-50';
            case 're-evaluation':
                return 'bg-orange-50';
            case 'kpi':
                return 'bg-green-50';
            case 'cpe':
                return 'bg-purple-50';
            case 'system':
                return 'bg-gray-50';
            default:
                return 'bg-gray-50';
        }
    }

    /**
     * Format notification time
     */
    formatTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString();
    }
}

export default new NotificationService();
