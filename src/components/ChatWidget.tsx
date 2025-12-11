import { useEffect, useState, useRef } from 'react';
import { messageAPI } from '../api/messages';
import { useAuthStore } from '../stores/authStore';
import { Send, X, RefreshCw, User, Loader2 } from 'lucide-react';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
}

export default function ChatWidget({ isOpen, onClose, studentId, studentName }: ChatWidgetProps) {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && studentId) {
            setInitialLoading(true);
            loadMessages().finally(() => {
                setInitialLoading(false);
                scrollToBottom();
            });
            // Poll for new messages every 1 minute instead of 1 hour to feel more responsive
            const interval = setInterval(loadMessages, 30000);
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
            // alert('Failed to send message'); // Removed alert for better UX, maybe add a toast later
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const getUserInitials = () => {
        if (!user) return 'ME';
        return getInitials(`${user.firstName} ${user.lastName}`);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
            <div
                className="bg-white w-full max-w-lg h-[600px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-gray-200"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                {getInitials(studentName)}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 leading-tight">
                                {studentName}
                            </h2>
                            <p className="text-xs text-green-600 font-medium flex items-center">
                                Online
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        {/* Visual-only action buttons for premium feel */}
                        
                        <button
                            onClick={() => loadMessages(true)}
                            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                            title="Refresh messages"
                            disabled={messagesLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${messagesLoading ? 'animate-spin' : ''}`} />
                        </button>
                        {/* <button className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button> */}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors ml-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50" style={{ minHeight: '300px' }}>
                    {initialLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Loading conversation...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">No messages yet</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-xs">
                                Send a message to start the conversation with {studentName}.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMine = message.isMine;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[85%] ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>

                                        {/* Avatar for message sender */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold pb-0.5 shadow-sm ring-2 ring-white ${isMine
                                                    ? 'bg-indigo-100 text-indigo-600'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {isMine ? getUserInitials() : getInitials(studentName)}
                                        </div>

                                        <div
                                            className={`group relative px-4 py-2.5 shadow-sm text-sm ${isMine
                                                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm border border-gray-100'
                                                }`}
                                        >
                                            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                            <p
                                                className={`text-[10px] mt-1 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'
                                                    }`}
                                            >
                                                {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                className="w-full pl-5 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-full text-sm transition-all outline-none placeholder:text-gray-400"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 shadow-sm ${!newMessage.trim() || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:scale-105 active:scale-95'
                                }`}
                            disabled={loading || !newMessage.trim()}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5 ml-0.5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
