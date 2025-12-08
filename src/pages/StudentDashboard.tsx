import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';
import { StudentDashboardSkeleton } from '../components/DashboardSkeleton';
import { MessageSquare, UserCheck, User, Megaphone, GraduationCap, MapPin, Building2} from "lucide-react";


export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [myAnnouncements, setMyAnnouncements] = useState<any[]>([]);
    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const myData = await announcementAPI.getMyAnnouncements();
            setMyAnnouncements(myData);

            const profileRes = await api.get('/student/profile');
            setStudentProfile(profileRes.data);

            if (user?.profile?.assignedMentorId) {
                try {
                    const mentorRes = await api.get('/student/mentor');
                    setMentor(mentorRes.data);
                } catch {
                    console.log("No mentor assigned");
                }
            }

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <StudentDashboardSkeleton />;

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* PAGE HEADING */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
      </header>

      {/* ALERTS */}
      <div className="space-y-3 mb-8">
        {!user?.emailVerified && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3">
            Please verify your email to create announcements.
          </div>
        )}

        {user?.status === 'pending' && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3">
            Your account is pending admin approval. You'll be notified once approved.
          </div>
        )}
      </div>

      {/* QUICK ACCESS SECTION */}
      {user?.emailVerified && user?.status === 'ACTIVE' && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Announcement */}
            <Link to="/announcements/create" className="block">
              <div className="rounded-xl p-5 border bg-white hover:shadow-md transition flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Create Announcement</h3>
                  <p className="text-sm text-gray-600">Share updates with the community</p>
                </div>
              </div>
            </Link>

            {/* Directory */}
            <Link to="/directory" className="block">
              <div className="rounded-xl p-5 border bg-white hover:shadow-md transition flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Find Students</h3>
                  <p className="text-sm text-gray-600">Connect with your peers</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — ANNOUNCEMENTS */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-4">My Announcements</h2>
              <div className="text-sm text-gray-600 hidden sm:block">
                {myAnnouncements.length} announcement{myAnnouncements.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-4">
              {myAnnouncements.length === 0 ? (
                <div className="text-gray-500 text-center py-8 bg-white border rounded-lg">
                  You haven't created any announcements yet
                </div>
              ) : (
                myAnnouncements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-3">
                      <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>

                      {/* Status badge: approved -> green, rejected -> red, else -> neutral */}
                      <div className="flex-shrink-0">
                        <span
                          className={`
                            px-2 py-1 text-xs rounded-full font-medium
                            ${announcement.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : announcement.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-200 text-gray-700'}
                          `}
                        >
                          {announcement.status}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <p className="text-gray-700 mb-2">{announcement.content}</p>

                    {/* REJECTION REMARKS */}
                    {announcement.rejectionRemarks && (
                      <div className="mt-2 p-3 bg-red-50 rounded border border-red-100">
                        <p className="text-sm text-red-700">
                          <strong>Rejection feedback:</strong> {announcement.rejectionRemarks}
                        </p>
                      </div>
                    )}

                    {/* META */}
                    <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
                      <div>{new Date(announcement.createdAt).toLocaleString?.() || ''}</div>
                      
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-6">
          {/* Mentor card */}
          {mentor && (
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> Your Mentor
                </h3>
              </div>

              <p className="font-medium text-gray-900">{mentor.firstName} {mentor.lastName}</p>
              <p className="text-sm text-gray-600">{mentor.email}</p>

              <Link
                to={`/messages?with=${mentor.id}`}
                className="mt-4 inline-block w-full text-center px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
              >
                <div className="inline-flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Message Mentor
                </div>
              </Link>
            </div>
          )}

          {/* Profile card */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Your Profile</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">

            <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="font-medium">College:</span>
                <span className="text-gray-600">{studentProfile?.profile?.college || '—'}</span>
            </div>

            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">City:</span>
                <span className="text-gray-600">{studentProfile?.profile?.city || '—'}</span>
            </div>

            <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Batch:</span>
                <span className="text-gray-600">{studentProfile?.profile?.batchYear || '—'}</span>
            </div>

            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
