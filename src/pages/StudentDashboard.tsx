// src/pages/StudentDashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  UserCheck,
  User,
  Megaphone,
  GraduationCap,
  MapPin,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';
import { StudentDashboardSkeleton } from '../components/DashboardSkeleton';
import { cache } from '../utils/cache';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [myAnnouncements, setMyAnnouncements] = useState<any[]>([]);
  const [mentor, setMentor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load dashboard data with optional cache usage.
   * If forceRefresh=true, bypass cache and fetch fresh data.
   */
  const loadData = async (forceRefresh = false) => {
    try {
      // Try cache
      if (!forceRefresh) {
        const cached = cache.get<any>('student-dashboard');
        if (cached) {
          setMyAnnouncements(cached.announcements || []);
          setStudentProfile(cached.profile || null);
          setMentor(cached.mentor || null);
          setLoading(false);
          return;
        }
      }

      setLoading(true);

      // fetch announcements + profile in parallel
      const [myData, profileRes] = await Promise.all([
        announcementAPI.getMyAnnouncements(),
        api.get('/student/profile'),
      ]);

      setMyAnnouncements(myData || []);
      setStudentProfile(profileRes?.data ?? null);

      // fetch mentor only if assigned
      let mentorData = null;
      if (profileRes?.data?.profile?.assignedMentorId || user?.profile?.assignedMentorId) {
        try {
          const mentorRes = await api.get('/student/mentor');
          mentorData = mentorRes?.data ?? null;
          setMentor(mentorData);
        } catch (err) {
          console.log('No mentor assigned or failed to fetch mentor');
          setMentor(null);
        }
      } else {
        setMentor(null);
      }

      // cache results (small TTL may be implemented inside your cache util)
      try {
        cache.set('student-dashboard', {
          announcements: myData,
          profile: profileRes?.data ?? null,
          mentor: mentorData,
        });
      } catch {
        // ignore cache errors
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <StudentDashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PAGE HEADING */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your announcements and connect with your mentor</p>
        </header>

        {/* ALERTS */}
        <div className="space-y-3 mb-8">
          {!user?.emailVerified && (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Email Verification Required</p>
                  <p className="text-sm text-yellow-700 mt-1">Please verify your email to create announcements.</p>
                </div>
              </div>
            </div>
          )}

          {user?.status === 'pending' && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Account Pending Approval</p>
                  <p className="text-sm text-blue-700 mt-1">Your account is pending admin approval. You'll be notified once approved.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUICK ACCESS SECTION */}
        {user?.emailVerified && user?.status === 'ACTIVE' && (
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Announcement */}
              <Link to="/announcements/create" className="block group">
                <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Megaphone className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">Create Announcement</h3>
                      <p className="text-sm text-gray-600 mt-1">Share updates with the community</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Directory */}
              <Link to="/directory" className="block group">
                <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Find Students</h3>
                      <p className="text-sm text-gray-600 mt-1">Connect with your peers</p>
                    </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-2xl font-bold text-gray-900">My Announcements</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                  {myAnnouncements.length} announcement{myAnnouncements.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-4">
                {myAnnouncements.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                        <Megaphone className="h-8 w-8 text-indigo-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">No announcements yet</p>
                      <p className="text-sm text-gray-500">Create your first announcement to get started</p>
                    </div>
                  </div>
                ) : (
                  myAnnouncements.map((announcement) => (
                    <article
                      key={announcement.id}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {/* HEADER */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                        <h3 className="font-bold text-xl text-gray-900">{announcement.title}</h3>

                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${announcement.status?.toLowerCase() === 'approved'
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

                      {/* CONTENT */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                      </div>

                      {/* REJECTION REMARKS */}
                      {announcement.rejectionRemarks && (
                        <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Rejection Feedback</p>
                              <p className="text-sm text-red-700 mt-1">{announcement.rejectionRemarks}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* META */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">{new Date(announcement.createdAt).toLocaleString?.() || ''}</div>
                        <div className="text-sm">
                          {/* optional actions could go here */}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Profile summary under announcements */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">College</div>
                    <div className="text-sm text-gray-700">{studentProfile?.profile?.college || '—'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</div>
                    <div className="text-sm text-gray-700">{studentProfile?.profile?.city || '—'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Batch</div>
                    <div className="text-sm text-gray-700">{studentProfile?.profile?.batchYear || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6">
            {/* Mentor card */}
            {mentor && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Your Mentor</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{mentor.firstName} {mentor.lastName}</p>
                    <p className="text-sm text-gray-600 mt-1">{mentor.email}</p>
                  </div>

                  <Link
                    to={`/messages?with=${mentor.id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-150"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Mentor
                  </Link>
                </div>
              </div>
            )}

            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Your Profile</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">College</p>
                    <p className="text-sm font-medium text-gray-900 mt-1 break-words">{studentProfile?.profile?.college || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">City</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{studentProfile?.profile?.city || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{studentProfile?.profile?.batchYear || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account pending / other small card */}
            {user?.status === 'pending' && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Account Pending Approval</p>
                    <p className="text-sm text-blue-700 mt-1">Your account is pending admin approval. You'll be notified once approved.</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
