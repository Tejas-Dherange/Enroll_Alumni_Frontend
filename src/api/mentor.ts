import api from './auth';

export const mentorAPI = {
    getAssignedStudents: async () => {
        const response = await api.get('/mentor/assigned-students');
        return response.data;
    },
    getPendingAnnouncements: async () => {
        const response = await api.get('/mentor/pending-announcements');
        return response.data;
    },
    approveAnnouncement: async (announcementId: string) => {
        const response = await api.post('/mentor/approve-announcement', { announcementId });
        return response.data;
    },
    rejectAnnouncement: async (announcementId: string, remarks?: string) => {
        const response = await api.post('/mentor/reject-announcement', { announcementId, remarks });
        return response.data;
    },
};
