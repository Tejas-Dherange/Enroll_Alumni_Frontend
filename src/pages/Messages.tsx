import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageAPI } from '../api/messages';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';

export default function Messages() {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const withUserId = searchParams.get('with');

    useEffect(() => {
        loadMentor();
    }, []);

    useEffect(() => {
        if (mentor) {
            loadMessages();
            const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
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

    const loadMessages = async () => {
        if (!mentor) return;
        try {
            const data = await messageAPI.getConversation(mentor.id);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
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
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Conversation with {mentor.firstName} {mentor.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">{mentor.email}</p>
                </div>

                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                        }`}
                                >
                                    <p>{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
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
