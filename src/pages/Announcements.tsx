import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { adminAPI } from '../api/admin';
import { useAuthStore } from '../stores/authStore';
import { AnnouncementsFeedSkeleton } from '../components/DashboardSkeleton';
import { Megaphone, User, Calendar, PlusCircle, Users } from 'lucide-react';
import Modal from '../components/Modal';
import { cache } from '../utils/cache';

export default function Announcements() {
    const { user } = useAuthStore();
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async (forceRefresh = false) => {
        // Try to load from cache first
        if (!forceRefresh) {
            const cachedData = cache.get<any[]>('announcements-feed');
            if (cachedData) {
                setFeed(cachedData);
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        try {
            const data = await announcementAPI.getFeed();
            setFeed(data);

            // Cache the data
            cache.set('announcements-feed', data);
        } catch (error) {
            console.error('Failed to load announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnnouncement = async () => {
        try {
            await adminAPI.deleteAnnouncement(selectedAnnouncement.id);
            setShowDeleteModal(false);
            setSelectedAnnouncement(null);
            // Invalidate cache and force refresh feed
            cache.invalidate('announcements-feed');
            loadFeed(true);
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    if (loading) {
        return <AnnouncementsFeedSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Announcement Feed
                            </h1>
                            <p className="text-gray-600 mt-2">Stay updated with the latest announcements</p>
                        </div>
                        {user?.role === 'STUDENT' && user?.emailVerified && user?.status === 'ACTIVE' && (
                            <Link
                                to="/announcements/create"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Create Announcement
                            </Link>
                        )}
                    </div>

                    {/* Count Badge */}
                    {feed.length > 0 && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                            {feed.length} announcement{feed.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {feed.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                                    <Megaphone className="h-10 w-10 text-indigo-600" />
                                </div>
                                <p className="text-lg font-medium text-gray-900 mb-2">No announcements yet</p>
                                <p className="text-sm text-gray-500 mb-6">Be the first to share an update with the community</p>
                                {user?.role === 'STUDENT' && user?.emailVerified && user?.status === 'ACTIVE' && (
                                    <Link
                                        to="/announcements/create"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
                                    >
                                        <PlusCircle className="h-5 w-5" />
                                        Create First Announcement
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        feed.map((announcement) => {
                            // Get initials from author name
                            const authorInitials = announcement.author
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase() || 'AN';

                            return (
                                <article
                                    key={announcement.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Author Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Author Avatar */}
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-base">{authorInitials}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <User className="h-4 w-4" />
                                                    <span>{announcement.author}</span>
                                                </div>
                                                <span className="text-gray-400">•</span>
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(announcement.approvedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>

            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Announcement">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete the announcement <strong>"{selectedAnnouncement?.title}"</strong>?
                    </p>
                    <p className="text-sm text-red-600">
                        This action cannot be undone. The announcement will be permanently removed.
                    </p>
                    <div className="flex space-x-3">
                        <button onClick={handleDeleteAnnouncement} className="btn btn-primary flex-1 bg-red-600 hover:bg-red-700">
                            Delete
                        </button>
                        <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
