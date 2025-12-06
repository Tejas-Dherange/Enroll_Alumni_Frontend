import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
        }
    }
    return config;
});

// Auth API
export const authAPI = {
    signup: async (data: any) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    verifyEmail: async (token: string) => {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },
    resendVerification: async (email: string) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },
    requestPasswordReset: async (email: string) => {
        const response = await api.post('/auth/request-password-reset', { email });
        return response.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export default api;
