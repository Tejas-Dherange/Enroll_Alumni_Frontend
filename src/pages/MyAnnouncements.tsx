import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import { Megaphone, AlertCircle, Plus } from 'lucide-react';

export default function MyAnnouncements() {
    const [myAnnouncements, setMyAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await announcementAPI.getMyAnnouncements();
            setMyAnnouncements(data || []);
        } catch (error) {
            console.error('Failed to load announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Announcements
                            </h1>
                            <p className="text-gray-600 mt-2">Track and manage your announcements</p>
                        </div>

                        {user?.role?.toUpperCase() === 'STUDENT' && user?.emailVerified && (
                            <button
                                onClick={() => navigate('/announcements/create')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                                text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 
                                transition-all duration-200 whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                Create Announcement
                            </button>
                        )}
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                        {myAnnouncements.length} announcement{myAnnouncements.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {myAnnouncements.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 sm:p-16 text-center">
                            <div className="flex flex-col items-center">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                                    <Megaphone className="h-8 w-8 text-indigo-600" />
                                </div>
                                <p className="text-lg font-medium text-gray-900 mb-1">No announcements yet</p>
                                <p className="text-sm text-gray-500">
                                    {user?.role?.toUpperCase() === 'STUDENT'
                                        ? 'Create your first announcement to get started'
                                        : 'Your announcements will appear here'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        myAnnouncements.map((announcement) => (
                            <article
                                key={announcement.id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                                    <h3 className="font-bold text-xl text-gray-900 break-words">{announcement.title}</h3>

                                    {/* Status badge */}
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shrink-0 self-start sm:self-auto ${announcement.status?.toLowerCase() === 'approved'
                                                ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20'
                                                : announcement.status?.toLowerCase() === 'rejected'
                                                    ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20'
                                                    : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
                                            }`}
                                    >
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${announcement.status?.toLowerCase() === 'approved' ? 'bg-green-600' :
                                                announcement.status?.toLowerCase() === 'rejected' ? 'bg-red-600' :
                                                    'bg-yellow-600'
                                            }`}></span>
                                        {announcement.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{announcement.content}</p>
                                </div>

                                {/* Rejection Remarks */}
                                {announcement.rejectionRemarks && (
                                    <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-red-800">Rejection Feedback</p>
                                                <p className="text-sm text-red-700 mt-1 break-words">{announcement.rejectionRemarks}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Meta */}
                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {new Date(announcement.createdAt).toLocaleString?.() || ''}
                                    </div>
                                    {announcement.approvedAt && (
                                        <div className="text-xs text-gray-400">
                                            Approved: {new Date(announcement.approvedAt).toLocaleString?.() || ''}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
