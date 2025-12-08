import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageAPI } from '../api/messages';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';
import { MessagesPageSkeleton, MessagesConversationSkeleton } from '../components/DashboardSkeleton';

export default function Messages() {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [initialMessagesLoading, setInitialMessagesLoading] = useState(true);
    const { user } = useAuthStore();
    const withUserId = searchParams.get('with');

    useEffect(() => {
        loadMentor();
    }, []);

    useEffect(() => {
        if (mentor) {
            setInitialMessagesLoading(true);
            loadMessages().finally(() => setInitialMessagesLoading(false));
            const interval = setInterval(loadMessages, 3600000); // Poll every 1 hour
            return () => clearInterval(interval);
        }
    }, [mentor]);

    const loadMentor = async () => {
        try {
            const response = await api.get('/student/mentor');
            setMentor(response.data);
        } catch (error) {
            console.error('Failed to load mentor:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (showLoading = false) => {
        if (!mentor) return;
        if (showLoading) setMessagesLoading(true);
        try {
            const data = await messageAPI.getConversation(mentor.id);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            if (showLoading) setMessagesLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !mentor) return;

        try {
            await messageAPI.sendMessage(mentor.id, newMessage);
            setNewMessage('');
            loadMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (loading) {
        return <MessagesPageSkeleton />;
    }

    if (!mentor) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    No mentor assigned yet. Please wait for admin approval.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card">
                <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Conversation with {mentor.firstName} {mentor.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                    </div>
                    <button
                        onClick={() => loadMessages(true)}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                        title="Refresh messages"
                        disabled={messagesLoading}
                    >
                        <svg className={`w-5 h-5 ${messagesLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                    {initialMessagesLoading ? (
                        <MessagesConversationSkeleton />
                    ) : messagesLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isMine
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-900'
                                        }`}
                                >
                                    <p>{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.isMine ? 'text-primary-100' : 'text-gray-500'}`}>
                                        {new Date(message.sentAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleSend} className="flex space-x-2">
                    <input
                        type="text"
                        className="input flex-1"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
