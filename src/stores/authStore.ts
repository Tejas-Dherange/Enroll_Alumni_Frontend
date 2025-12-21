import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    mobileNumber?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    bio?: string;
    role: string; // Accept any string to handle both uppercase and lowercase from Prisma
    status: string;
    emailVerified: boolean;
    profile?: {
        college?: string;
        city?: string;
        batchYear?: number;
        assignedMentorId?: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
            setUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
