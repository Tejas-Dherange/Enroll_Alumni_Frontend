import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [feed, setFeed] = useState<any[]>([]);
    const [myAnnouncements, setMyAnnouncements] = useState<any[]>([]);
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [feedData, myData] = await Promise.all([
                announcementAPI.getFeed(),
                announcementAPI.getMyAnnouncements(),
            ]);
            setFeed(feedData);
            setMyAnnouncements(myData);

            // Load mentor info if assigned
            if (user?.profile?.assignedMentorId) {
                try {
                    const response = await api.get('/student/mentor');
                    setMentor(response.data);
                } catch (error) {
                    console.log('No mentor assigned yet');
                }
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                {user?.emailVerified && user?.status === 'active' && (
                    <Link to="/announcements/create" className="btn btn-primary">
                        Create Announcement
                    </Link>
                )}
            </div>

            {!user?.emailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                    Please verify your email to create announcements.
                </div>
            )}

            {user?.status === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                    Your account is pending admin approval. You'll be notified once approved.
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Announcement Feed</h2>
                        <div className="space-y-4">
                            {feed.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No announcements yet</p>
                            ) : (
                                feed.map((announcement) => (
                                    <div key={announcement.id} className="card">
                                        <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                                        <p className="text-gray-700 mb-2">{announcement.content}</p>
                                        <p className="text-sm text-gray-500">
                                            By {announcement.author} • {new Date(announcement.publishedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">My Announcements</h2>
                        <div className="space-y-4">
                            {myAnnouncements.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">You haven't created any announcements yet</p>
                            ) : (
                                myAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="card">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${announcement.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    announcement.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {announcement.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{announcement.content}</p>
                                        {announcement.rejectionRemarks && (
                                            <div className="mt-2 p-2 bg-red-50 rounded">
                                                <p className="text-sm text-red-700">
                                                    <strong>Rejection feedback:</strong> {announcement.rejectionRemarks}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {mentor && (
                        <div className="card">
                            <h3 className="font-semibold text-lg mb-3">Your Mentor</h3>
                            <p className="font-medium">{mentor.firstName} {mentor.lastName}</p>
                            <p className="text-sm text-gray-600">{mentor.email}</p>
                            <Link to={`/messages?with=${mentor.id}`} className="btn btn-primary w-full mt-4">
                                Message Mentor
                            </Link>
                        </div>
                    )}

                    <div className="card">
                        <h3 className="font-semibold text-lg mb-3">Your Profile</h3>
                        <p className="text-sm text-gray-600">
                            <strong>College:</strong> {user?.profile?.college}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>City:</strong> {user?.profile?.city}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Batch:</strong> {user?.profile?.batchYear}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
