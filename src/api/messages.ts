import api from './auth';

export const messageAPI = {
    sendMessage: async (receiverId: string, content: string) => {
        const response = await api.post('/messages/send', { receiverId, content });
        return response.data;
    },
    getConversation: async (userId: string) => {
        const response = await api.get(`/messages/conversation?with=${userId}`);
        return response.data;
    },
};
