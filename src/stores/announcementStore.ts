import { create } from 'zustand';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author?: string;
    status?: string;
    publishedAt?: string;
    createdAt?: string;
    approvedAt?: string;
    rejectionRemarks?: string;
}

interface AnnouncementState {
    feed: Announcement[];
    myAnnouncements: Announcement[];
    pendingAnnouncements: Announcement[];
    setFeed: (feed: Announcement[]) => void;
    setMyAnnouncements: (announcements: Announcement[]) => void;
    setPendingAnnouncements: (announcements: Announcement[]) => void;
    addAnnouncement: (announcement: Announcement) => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
    feed: [],
    myAnnouncements: [],
    pendingAnnouncements: [],
    setFeed: (feed) => set({ feed }),
    setMyAnnouncements: (myAnnouncements) => set({ myAnnouncements }),
    setPendingAnnouncements: (pendingAnnouncements) => set({ pendingAnnouncements }),
    addAnnouncement: (announcement) =>
        set((state) => ({ myAnnouncements: [announcement, ...state.myAnnouncements] })),
}));
