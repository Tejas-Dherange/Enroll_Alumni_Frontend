import api from './auth';

export const adminAPI = {
    getPendingStudents: async (params?: any) => {
        const response = await api.get('/admin/pending-students', { params });
        return response.data;
    },
    approveStudent: async (studentId: string, mentorId: string) => {
        const response = await api.post('/admin/approve-student', { studentId, mentorId });
        return response.data;
    },
    getAllMentors: async () => {
        const response = await api.get('/admin/mentors');
        return response.data;
    },
    getAllStudents: async (params?: any) => {
        const response = await api.get('/admin/students', { params });
        return response.data;
    },
    getAllAnnouncements: async () => {
        const response = await api.get('/admin/announcements');
        return response.data;
    },
    getPendingAnnouncements: async () => {
        const response = await api.get('/admin/pending-announcements');
        return response.data;
    },
    approveAnnouncement: async (announcementId: string, targetBatches?: number[]) => {
        const response = await api.post('/admin/approve-announcement', { announcementId, targetBatches });
        return response.data;
    },
    rejectAnnouncement: async (announcementId: string, remarks?: string) => {
        const response = await api.post('/admin/reject-announcement', { announcementId, remarks });
        return response.data;
    },
    getBatchYears: async () => {
        const response = await api.get('/admin/batch-years');
        return response.data;
    },
    blockUser: async (userId: string) => {
        const response = await api.post('/admin/block-user', { userId });
        return response.data;
    },
    unblockUser: async (userId: string) => {
        const response = await api.post('/admin/unblock-user', { userId });
        return response.data;
    },
    sendAnnouncement: async (title: string, content: string, sendEmail: boolean, sendSMS: boolean) => {
        const response = await api.post('/admin/send-announcement', { title, content, sendEmail, sendSMS });
        return response.data;
    },
    sendBroadcast: async (title: string, content: string) => {
        const response = await api.post('/admin/send-announcement', { title, content, sendEmail: false, sendSMS: false });
        return response.data;
    },
    getStatistics: async () => {
        const response = await api.get('/admin/statistics');
        return response.data;
    },
    addMentor: async (mentorData: { firstName: string; lastName: string; email: string; password: string }) => {
        const response = await api.post('/admin/add-mentor', mentorData);
        return response.data;
    },
    deleteAnnouncement: async (announcementId: string) => {
        const response = await api.delete(`/admin/announcements/${announcementId}`);
        return response.data;
    },
};
