import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import { AnnouncementsFeedSkeleton } from '../components/DashboardSkeleton';

export default function Announcements() {
    const { user } = useAuthStore();
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        setLoading(true);
        try {
            const data = await announcementAPI.getFeed();
            setFeed(data);
        } catch (error) {
            console.error('Failed to load announcements:', error);
        } finally {
            setLoading(false);
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
                            <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
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
        </div>
    );
}
