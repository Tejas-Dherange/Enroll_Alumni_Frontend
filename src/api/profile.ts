import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const profileAPI = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    updateProfile: async (data: {
        firstName?: string;
        lastName?: string;
        mobileNumber?: string;
        linkedInUrl?: string;
        githubUrl?: string;
        bio?: string;
        college?: string;
        city?: string;
        batchYear?: number;
    }) => {
        const response = await api.put('/profile', data);
        return response.data;
    },
};

export default profileAPI;
