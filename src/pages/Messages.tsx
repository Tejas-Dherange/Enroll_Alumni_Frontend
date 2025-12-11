// src/pages/Messages.tsx
import { useEffect, useRef, useState } from 'react';
import { messageAPI } from '../api/messages';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';
import { MessagesPageSkeleton } from '../components/DashboardSkeleton';
import { Send, RefreshCw, Loader2, User } from 'lucide-react';

function getInitials(name?: string) {
    if (!name) return 'NA';
    return name
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function Avatar({ src, name, size = 10 }: { src?: string | null; name?: string; size?: number }) {
    if (src) {
        return (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
                src={src}
                alt={`${name} avatar`}
                className="rounded-full object-cover"
                style={{ width: size * 4, height: size * 4 }}
            />
        );
    }
    return (
        <div
            className={`rounded-full flex items-center justify-center font-semibold text-white shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600`}
            style={{
                width: size * 4,
                height: size * 4,
            }}
            aria-hidden
        >
            {getInitials(name)}
        </div>
    );
}

export default function Messages() {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const endRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        loadMentor();
    }, []);

    useEffect(() => {
        if (!mentor) return;
        setInitialLoading(true);
        loadMessages().finally(() => setInitialLoading(false));
        // follow widget cadence: poll every 30s
        const interval = setInterval(loadMessages, 30_000);
        return () => clearInterval(interval);
    }, [mentor]);

    useEffect(() => {
        // scroll to bottom when messages update
        const el = containerRef.current;
        if (!el) return;
        setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 80);
    }, [messages]);

    const loadMentor = async () => {
        try {
            const res = await api.get('/student/mentor');
            setMentor(res.data);
        } catch (err) {
            console.error('Failed to load mentor', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (showLoading = false) => {
        if (!mentor) return;
        if (showLoading) setMessagesLoading(true);
        try {
            const data = await messageAPI.getConversation(mentor.id);
            setMessages(Array.isArray(data) ? data.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()) : []);
        } catch (err) {
            console.error('Failed to load messages', err);
        } finally {
            if (showLoading) setMessagesLoading(false);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !mentor) return;

        const content = newMessage.trim();
        const tempId = `temp-${Date.now()}`;
        const optimistic = { id: tempId, content, isMine: true, sentAt: new Date().toISOString() };

        setMessages((prev) => [...prev, optimistic]);
        setNewMessage('');
        setLoading(true);

        try {
            await messageAPI.sendMessage(mentor.id, content);
            await loadMessages();
        } catch (err) {
            console.error('Failed to send message', err);
            await loadMessages();
        } finally {
            setLoading(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (iso?: string) => {
        if (!iso) return '';
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return iso || '';
        }
    };

    if (loading) return <MessagesPageSkeleton />;

    if (!mentor) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                    No mentor assigned yet. Please wait for admin approval.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[75vh] max-h-[85vh]">

                {/* Header (mirrors ChatWidget) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar src={mentor.avatarUrl} name={`${mentor.firstName} ${mentor.lastName}`} size={10} />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                {mentor.firstName} {mentor.lastName}
                            </div>
                            <div className="text-xs text-green-600 font-medium">Online</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadMessages(true)}
                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                            title="Refresh messages"
                            disabled={messagesLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${messagesLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Messages area */}
                <div ref={containerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
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
                            <p className="text-xs text-gray-500 mt-1 max-w-xs">Send a message to start the conversation with {mentor.firstName}.</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMine = !!message.isMine;
                            return (
                                <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end gap-2 max-w-[85%] ${isMine ? 'flex-row-reverse' : ''}`}>
                                        {/* avatar */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold pb-0.5 shadow-sm ring-2 ring-white ${isMine ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {isMine ? getInitials(`${user?.firstName} ${user?.lastName}`) : getInitials(`${mentor.firstName} ${mentor.lastName}`)}
                                        </div>

                                        {/* bubble */}
                                        <div className={`group relative px-4 py-2.5 text-sm shadow-sm break-words ${isMine ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm border border-gray-100'
                                            }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                {formatTime(message.sentAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div ref={endRef} />
                </div>

                {/* Input area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                className="w-full pl-5 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-full text-sm transition-all outline-none placeholder:text-gray-400"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={onKeyDown}
                                disabled={loading}
                                aria-label="Type your message"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 shadow-sm ${!newMessage.trim() || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:scale-105 active:scale-95'
                                }`}
                            disabled={loading || !newMessage.trim()}
                            aria-label="Send message"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
