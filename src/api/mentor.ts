import api from './auth';

export const mentorAPI = {
    getAssignedStudents: async () => {
        const response = await api.get('/mentor/assigned-students');
        return response.data;
    },
    blockStudent: async (studentId: string) => {
        const response = await api.post('/mentor/block-student', { studentId });
        return response.data;
    },
    unblockStudent: async (studentId: string) => {
        const response = await api.post('/mentor/unblock-student', { studentId });
        return response.data;
    },
    broadcastToStudents: async (title: string, content: string) => {
        const response = await api.post('/mentor/broadcast-to-students', { title, content });
        return response.data;
    },
    broadcastToMentors: async (title: string, content: string) => {
        const response = await api.post('/mentor/broadcast-to-mentors', { title, content });
        return response.data;
    },
};
