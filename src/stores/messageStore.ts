import { create } from 'zustand';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: string;
    senderName?: string;
    isOwn?: boolean;
}

interface MessageState {
    conversations: Record<string, Message[]>;
    setConversation: (userId: string, messages: Message[]) => void;
    addMessage: (userId: string, message: Message) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    conversations: {},
    setConversation: (userId, messages) =>
        set((state) => ({
            conversations: { ...state.conversations, [userId]: messages },
        })),
    addMessage: (userId, message) =>
        set((state) => ({
            conversations: {
                ...state.conversations,
                [userId]: [...(state.conversations[userId] || []), message],
            },
        })),
}));
