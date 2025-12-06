import api from './auth';

export const announcementAPI = {
    createAnnouncement: async (title: string, content: string) => {
        const response = await api.post('/announcements/create', { title, content });
        return response.data;
    },
    getFeed: async () => {
        const response = await api.get('/announcements/feed');
        return response.data;
    },
    getMyAnnouncements: async () => {
        const response = await api.get('/announcements/my-announcements');
        return response.data;
    },
};
