import api from './auth';

export const studentAPI = {
    getProfile: async () => {
        const response = await api.get('/student/profile');
        return response.data;
    },
    getMentor: async () => {
        const response = await api.get('/student/mentor');
        return response.data;
    },
    searchDirectory: async (filters?: { college?: string; city?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.college) params.append('college', filters.college);
        if (filters?.city) params.append('city', filters.city);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get(`/student/directory?${params.toString()}`);
        return response.data;
    },
    getColleges: async () => {
        const response = await api.get('/student/colleges');
        console.log("getColleges", response.data);
        return response.data;
    },
    getCities: async () => {
        const response = await api.get('/student/cities');
        return response.data;
    },
    getBatches: async () => {
        const response = await api.get('/student/batches');
        return response.data;
    },
};
