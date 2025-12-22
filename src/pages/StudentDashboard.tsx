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
  Edit,
  Linkedin,
  Github,
} from 'lucide-react';
import { announcementAPI } from '../api/announcements';
import { useAuthStore } from '../stores/authStore';
import api from '../api/auth';
import { StudentDashboardSkeleton } from '../components/DashboardSkeleton';
import { cache } from '../utils/cache';
import EditProfileModal from '../components/EditProfileModal';
import ChatWidget from '../components/ChatWidget';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const [myAnnouncements, setMyAnnouncements] = useState<any[]>([]);
  const [mentor, setMentor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = cache.get<any>('student-dashboard');
        if (cached) {
          setMyAnnouncements(cached.announcements || []);
          setMentor(cached.mentor || null);
          setLoading(false);
          return;
        }
      }

      setLoading(true);

      const [myData, profileRes] = await Promise.all([
        announcementAPI.getMyAnnouncements(),
        api.get('/student/profile'),
      ]);

      setMyAnnouncements(myData || []);

      let mentorData = null;
      const assignedMentorId =
        profileRes?.data?.profile?.assignedMentorId ||
        user?.profile?.assignedMentorId;

      if (assignedMentorId) {
        try {
          const mentorRes = await api.get('/student/mentor');
          mentorData = mentorRes?.data ?? null;
          setMentor(mentorData);
        } catch {
          setMentor(null);
        }
      }

      cache.set('student-dashboard', {
        announcements: myData,
        mentor: mentorData,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <StudentDashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your announcements and manage your profile
          </p>
        </header>

        {/* ALERTS */}
        <div className="space-y-3 mb-8">
          {!user?.emailVerified && (
            <AlertBox
              color="yellow"
              title="Email Verification Required"
              text="Please verify your email to create announcements."
            />
          )}

          {user?.status === 'pending' && (
            <AlertBox
              color="blue"
              title="Account Pending Approval"
              text="Your account is pending admin approval."
            />
          )}
        </div>

        {/* QUICK ACTIONS */}
        {user?.emailVerified && user?.status === 'ACTIVE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <QuickCard
              to="/announcements/create"
              title="Create Announcement"
              subtitle="Share updates with the community"
              icon={<Megaphone className="w-7 h-7 text-white" />}
              gradient="from-blue-500 to-cyan-600"
            />

            <QuickCard
              to="/directory"
              title="Find Students"
              subtitle="Connect with your peers"
              icon={<User className="w-7 h-7 text-white" />}
              gradient="from-blue-500 to-cyan-600"
            />
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ANNOUNCEMENTS */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              My Announcements
            </h2>

            {myAnnouncements.length === 0 ? (
              <EmptyState />
            ) : (
              myAnnouncements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">

            {/* MENTOR */}
            {mentor && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Your Mentor</h3>
                </div>

                <p className="font-semibold">{mentor.firstName} {mentor.lastName}</p>
                <p className="text-sm text-gray-600">{mentor.email}</p>

                <button
                  onClick={() => setShowChatWidget(true)}
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-150"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Mentor
                </button>
              </div>
            )}

            {/* PROFILE CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">Your Profile</h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 hover:bg-indigo-50 rounded-lg"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <p className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>

              <ProfileRow icon={<Building2 className='text-blue-500' />} label="College" value={user?.profile?.college} />
              <ProfileRow icon={<MapPin className='text-blue-500' />} label="City" value={user?.profile?.city} />
              <ProfileRow icon={<GraduationCap className='text-blue-500' />} label="Batch" value={user?.profile?.batchYear} />

              {(user?.linkedInUrl || user?.githubUrl) && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2 uppercase">Social</p>
                  <div className="flex gap-2">
                    {user?.linkedInUrl && (
                      <a href={user.linkedInUrl} target="_blank" rel="noreferrer" className="icon-btn blue">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {user?.githubUrl && (
                      <a href={user.githubUrl} target="_blank" rel="noreferrer" className="icon-btn gray">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          cache.invalidate('student-dashboard');
          loadData(true);
        }}
      />

      {/* Chat Widget */}
      {mentor && (
        <ChatWidget
          isOpen={showChatWidget}
          onClose={() => setShowChatWidget(false)}
          studentId={mentor.id}
          studentName={`${mentor.firstName} ${mentor.lastName}`}
        />
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function ProfileRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mt-3">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-xs uppercase text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}

function AlertBox({ color, title, text }: any) {
  const colors: any = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{text}</p>
    </div>
  );
}

function QuickCard({ to, title, subtitle, icon, gradient }: any) {
  return (
    <Link to={to} className="block">
      <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:-translate-y-1">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
      <Megaphone className="mx-auto mb-3 text-indigo-500" />
      <p className="font-semibold">No announcements yet</p>
      <p className="text-sm text-gray-500">Create one to get started</p>
    </div>
  );
}

function AnnouncementCard({ announcement }: any) {
  return (
    <article className="bg-white border rounded-2xl p-5 shadow-md">
      <h3 className="font-bold text-lg mb-2">{announcement.title}</h3>
      <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
    </article>
  );
}
