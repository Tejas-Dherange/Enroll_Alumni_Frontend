import api from './auth';

export const adminAPI = {
    getPendingStudents: async () => {
        const response = await api.get('/admin/pending-students');
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
    getAllStudents: async () => {
        const response = await api.get('/admin/students');
        return response.data;
    },
    getAllAnnouncements: async () => {
        const response = await api.get('/admin/announcements');
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
    getStatistics: async () => {
        const response = await api.get('/admin/statistics');
        return response.data;
    },
};
