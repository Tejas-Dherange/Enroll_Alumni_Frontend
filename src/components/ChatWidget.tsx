import { useEffect, useState } from 'react';
import { messageAPI } from '../api/messages';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
}

export default function ChatWidget({ isOpen, onClose, studentId, studentName }: ChatWidgetProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (isOpen && studentId) {
            setInitialLoading(true);
            loadMessages().finally(() => setInitialLoading(false));
            // Poll for new messages every 1 hour
            const interval = setInterval(loadMessages, 3600000);
            return () => clearInterval(interval);
        }
    }, [isOpen, studentId]);

    const loadMessages = async (showLoading = false) => {
        if (showLoading) setMessagesLoading(true);
        try {
            const data = await messageAPI.getConversation(studentId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            if (showLoading) setMessagesLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            await messageAPI.sendMessage(studentId, newMessage);
            setNewMessage('');
            await loadMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: '80vh' }}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Chat with {studentName}
                    </h2>
                    <div className="flex items-center space-x-2">
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
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '400px' }}>
                    {initialLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="ml-3 text-gray-600">Loading messages...</p>
                        </div>
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

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSend} className="flex space-x-2">
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !newMessage.trim()}
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
