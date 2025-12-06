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
    const [studentProfile, setStudentProfile] = useState<any>(null);
    console.log("User  ", user);

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

            const studentProfileResponse = await api.get('/student/profile');
            setStudentProfile(studentProfileResponse.data);
            // console.log("Student Profile", studentProfileResponse.data);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

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

            {/* Quick Access Section */}
            {user?.emailVerified && user?.status === 'ACTIVE' && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link to="/announcements/create" className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Create Announcement</h3>
                                    <p className="text-sm text-gray-600">Share updates with the community</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/directory" className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Find Students</h3>
                                    <p className="text-sm text-gray-600">Connect with your peers</p>
                                </div>
                            </div>
                        </Link>
                    </div>
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
                            <strong>College:</strong> {studentProfile.profile.college}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>City:</strong> {studentProfile.profile.city}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Batch:</strong> {studentProfile.profile.batchYear}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
