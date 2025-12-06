import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';

export default function AnnouncementCreate() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await announcementAPI.createAnnouncement(title, content);
            navigate('/student');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    if (!user?.emailVerified) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    You must verify your email before creating announcements.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Announcement</h1>

            <form onSubmit={handleSubmit} className="card space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="label">Title</label>
                    <input
                        id="title"
                        type="text"
                        required
                        className="input"
                        placeholder="Enter announcement title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="content" className="label">Content</label>
                    <textarea
                        id="content"
                        required
                        rows={6}
                        className="input"
                        placeholder="Write your announcement..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                        Your announcement will be sent to your mentor for approval before it appears in the feed.
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? 'Creating...' : 'Create Announcement'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/student')}
                        className="btn btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
