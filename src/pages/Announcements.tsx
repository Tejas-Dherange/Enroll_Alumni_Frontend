import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { adminAPI } from '../api/admin';
import { useAuthStore } from '../stores/authStore';
import { AnnouncementsFeedSkeleton } from '../components/DashboardSkeleton';
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Announcement Feed</h1>
                {user?.role === 'STUDENT' && user?.emailVerified && user?.status === 'ACTIVE' && (
                    <Link to="/announcements/create" className="btn btn-primary">
                        Create Announcement
                    </Link>
                )}
            </div>

            <div className="space-y-4">
                {feed.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500 mb-4">No announcements yet</p>
                        {user?.role === 'STUDENT' && user?.emailVerified && user?.status === 'ACTIVE' && (
                            <Link to="/announcements/create" className="btn btn-primary">
                                Create First Announcement
                            </Link>
                        )}
                    </div>
                ) : (
                    feed.map((announcement) => (
                        <div key={announcement.id} className="card">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                                {user?.role === 'ADMIN' && (
                                    <button
                                        onClick={() => {
                                            setSelectedAnnouncement(announcement);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Delete announcement"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{announcement.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>By {announcement.author}</span>
                                <span>{new Date(announcement.approvedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    ))
                )}
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
