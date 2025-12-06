import api from './auth';

export const notificationAPI = {
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },
    markAsRead: async (id: string) => {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await api.put('/notifications/read-all');
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },
};
