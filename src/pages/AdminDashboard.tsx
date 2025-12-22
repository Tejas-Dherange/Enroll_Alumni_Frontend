// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';
import AddMentorModal from '../components/AddMentorModal';
import StudentsSection from '../components/admin/StudentsSection';
import MentorsSection from '../components/admin/MentorsSection';
import { StatisticsSkeleton, ListSkeleton } from '../components/DashboardSkeleton';
import { motion } from 'framer-motion';


import {
  Plus,
  Megaphone,
  BarChart3,
  Clock,
  Users,
  UserCog,
  Bell,
  Volume2,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'statistics' | 'pending' | 'students' | 'mentors' | 'pending-announcements' | 'announcements'
  >('statistics');

  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejectStudentModal, setShowRejectStudentModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApprovingAnnouncement, setIsApprovingAnnouncement] = useState(false);
  const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
  const [availableBatches, setAvailableBatches] = useState<number[]>([]);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [isRejectingStudent, setIsRejectingStudent] = useState(false);




  // pagination for lists when we request filtered data
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, pageSize]);



  /* -------------------- DATA LOAD -------------------- */

  const loadData = async (forceRefresh = false) => {
    if (!forceRefresh && loadedTabs.has(activeTab)) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'statistics':
          setStatistics(await adminAPI.getStatistics());
          break;

        case 'pending': {
          // try to pass filters + pagination if endpoint supports it
          // try to pass filters + pagination if endpoint supports it
          const payload = { page, pageSize };
          const pending = await (adminAPI.getPendingStudents?.(payload) ?? adminAPI.getPendingStudents?.() ?? []);
          setPendingStudents(pending.items ?? pending ?? []);
          setTotal(pending.total ?? (pending.items?.length ?? (Array.isArray(pending) ? pending.length : 0)));
          if (mentors.length === 0) setMentors(await adminAPI.getAllMentors());
          break;
        }

        case 'students': {
          // Fetch all students so StudentsSection can handle client-side filtering/pagination
          const studentsRes = await (adminAPI.getAllStudents?.() ?? []);
          setAllStudents(studentsRes.items ?? studentsRes ?? []);
          setTotal(studentsRes.total ?? (studentsRes.items?.length ?? (Array.isArray(studentsRes) ? studentsRes.length : 0)));
          if (mentors.length === 0) setMentors(await adminAPI.getAllMentors());
          break;
        }

        case 'mentors':
          setMentors(await adminAPI.getAllMentors());
          break;

        case 'pending-announcements':
          setPendingAnnouncements(await adminAPI.getPendingAnnouncements());
          if (availableBatches.length === 0)
            setAvailableBatches((await adminAPI.getBatchYears?.()) ?? []);
          break;

        case 'announcements':
          setAnnouncements(await adminAPI.getAllAnnouncements());
          break;
      }

      setLoadedTabs((prev) => new Set(prev).add(activeTab));
    } catch (e) {
      console.error('Error loading:', e);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- ACTIONS -------------------- */



  const handleApprove = async () => {
    if (!selectedStudent) return;
    setIsApproving(true);
    try {
      await adminAPI.approveStudent(selectedStudent.id, selectedMentor);

      setShowApproveModal(false);
      setSelectedStudent(null);
      setSelectedMentor('');

      refreshTabs('pending', 'students', 'statistics');
    } catch (error) {
      console.error("Error approving student", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectStudent = async () => {
    if (!selectedStudent) return;
    setIsRejectingStudent(true);
    try {
      await adminAPI.rejectStudent(selectedStudent.id);
      setShowRejectStudentModal(false);
      setSelectedStudent(null);
      refreshTabs('pending', 'students', 'statistics');
    } catch (error) {
      console.error("Error rejecting student", error);
    } finally {
      setIsRejectingStudent(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      setAllStudents((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, status: 'BLOCKED' } : s))
      );
      setMentors((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, status: 'BLOCKED' } : m))
      );
      await adminAPI.blockUser(userId);
    } catch {
      refreshTabs(activeTab);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      setAllStudents((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, status: 'ACTIVE' } : s))
      );
      setMentors((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, status: 'ACTIVE' } : m))
      );
      await adminAPI.unblockUser(userId);
    } catch {
      refreshTabs(activeTab);
    }
  };

  const refreshTabs = (...tabs: string[]) => {
    setLoadedTabs((prev) => {
      const next = new Set(prev);
      tabs.forEach((t) => next.delete(t));
      return next;
    });
    loadData(true);
  };

  const handleApproveAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    setIsApprovingAnnouncement(true);
    try {
      await adminAPI.approveAnnouncement(selectedAnnouncement.id, selectedBatches);

      setSelectedAnnouncement(null);
      setShowBatchModal(false);
      setSelectedBatches([]);

      refreshTabs('pending-announcements', 'announcements');
    } catch (error) {
      console.error('Failed to approve announcement:', error);
    } finally {
      setIsApprovingAnnouncement(false);
    }
  };

  const handleRejectAnnouncement = async () => {
    if (!selectedAnnouncement || !rejectionRemarks.trim()) return;

    await adminAPI.rejectAnnouncement(
      selectedAnnouncement.id,
      rejectionRemarks
    );

    setSelectedAnnouncement(null);
    setShowRejectModal(false);
    setRejectionRemarks('');

    refreshTabs('pending-announcements', 'announcements');
  };

  const handleSendAnnouncement = async (title: string, content: string) => {
    await adminAPI.sendBroadcast(title, content);
    setShowBroadcastModal(false);
    refreshTabs('announcements');
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    setIsDeletingAnnouncement(true);
    try {
      await adminAPI.deleteAnnouncement(selectedAnnouncement.id);
      setShowDeleteModal(false);
      refreshTabs('announcements');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    } finally {
      setIsDeletingAnnouncement(false);
    }
  };

  const toggleBatch = (b: number) =>
    setSelectedBatches((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const startIdx = total === 0 ? 0 : (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + (activeTab === 'students' ? allStudents.length : pendingStudents.length), total || (activeTab === 'students' ? allStudents.length : pendingStudents.length));
  const totalPages = Math.max(1, Math.ceil((total || (activeTab === 'students' ? allStudents.length : pendingStudents.length)) / pageSize));

  /* -------------------------------------------------------------- */
  /*                            RENDER                              */
  /* -------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6 md:py-8 w-full overflow-x-hidden">

        {/* ------------------ HEADER ------------------ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your platform with ease</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {activeTab === 'mentors' && (
              <button
                onClick={() => setShowAddMentorModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50
                text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition"
              >
                <Plus className="h-5 w-5" />
                Add Mentor
              </button>
            )}

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md text-white
              bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 
              transition-all"
            >
              <Megaphone className="h-5 w-5" />
              Send Announcement
            </button>
          </div>
        </div>

        {/* ------------------ TABS ------------------ */}
        <nav className="relative flex gap-2 mb-5 bg-white rounded-xl border border-gray-200 p-2 overflow-x-auto">
  {[
    { id: 'statistics', label: 'Statistics', Icon: BarChart3 },
    { id: 'pending', label: 'Pending Students', Icon: Clock },
    { id: 'students', label: 'Students', Icon: Users },
    { id: 'mentors', label: 'Mentors', Icon: UserCog },
    { id: 'pending-announcements', label: 'Pending Announcements', Icon: Bell },
    { id: 'announcements', label: 'Announcements', Icon: Volume2 },
  ].map((tab) => {
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id as any)}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap"
      >
        {/* SLIDING ACTIVE BACKGROUND */}
        {isActive && (
          <motion.span
            layoutId="activeTab"
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600"
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        {/* CONTENT */}
        <span
          className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <tab.Icon className="h-5 w-5" />
          {tab.label}
        </span>
      </button>
    );
  })}
</nav>



        {/* footer line with count & per-page + pagination controls at right */}
        {/* footer line with count & per-page + pagination controls at right */}
        {activeTab === 'pending' && (
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="text-sm text-slate-600">
              {total === 0 ? (
                <>Showing 0 items</>
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-900">{startIdx + 1}</span>–{' '}
                  <span className="font-semibold text-slate-900">{endIdx}</span> of{' '}
                  <span className="font-semibold text-slate-900">{total}</span> items
                </>
              )}
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
              <label className="text-xs text-slate-600 hidden md:inline">Per page</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[6, 12, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              {/* Pagination controls moved to bottom-right */}
              <div className="ml-2 flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-white text-sm ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-sm text-slate-600 px-2">
                  Page {page}/{totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-white text-sm ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:shadow hover:bg-gray-50'
                    }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ------------------ LOADING / TABS CONTENT ------------------ */}
        {loading ? (
          <>
            {activeTab === 'statistics' && <StatisticsSkeleton />}
            {['pending', 'students', 'mentors', 'announcements', 'pending-announcements'].includes(activeTab) && (
              <ListSkeleton />
            )}
          </>
        ) : (
          <>
            {/* ---------------- STATISTICS ---------------- */}
            {activeTab === 'statistics' && statistics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                {/* Students Card */}
                <DashboardCard
                  title="Students"
                  count={statistics.students.total}
                  colors="from-blue-600 to-cyan-600"
                  icon={Users}
                  stats={[
                    { label: 'Active', color: 'green', value: statistics.students.active },
                    { label: 'Pending', color: 'yellow', value: statistics.students.pending },
                  ]}
                />

                {/* Mentors */}
                <DashboardCard
                  title="Mentors"
                  count={statistics.mentors.total}
                  colors="from-blue-600 to-cyan-600"
                  icon={UserCog}
                />

                {/* Announcements */}
                <DashboardCard
                  title="Announcements"
                  count={statistics.announcements.total}
                  colors="from-blue-600 to-cyan-600"
                  icon={Volume2}
                  stats={[
                    { label: 'Pending', color: 'yellow', value: statistics.announcements.pending },
                    { label: 'Approved', color: 'green', value: statistics.announcements.approved },
                  ]}
                />
              </div>
            )}

            {/* ---------------- PENDING STUDENTS ---------------- */}
            {activeTab === 'pending' && (
              <ResponsiveList
                emptyText="No pending students"
                items={pendingStudents}
                renderItem={(student: any) => (
                  <StudentPendingCard
                    student={student}
                    onApprove={() => {
                      setSelectedStudent(student);
                      setShowApproveModal(true);
                    }}
                    onReject={() => {
                      setSelectedStudent(student);
                      setShowRejectStudentModal(true);
                    }}
                  />
                )}
              />
            )}

            {/* ---------------- STUDENTS ---------------- */}
            {activeTab === 'students' && (
              <StudentsSection
                students={allStudents}
                mentors={mentors}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
              />
            )}

            {/* ---------------- MENTORS ---------------- */}
            {activeTab === 'mentors' && (
              <MentorsSection
                mentors={mentors}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
              />
            )}

            {/* ---------------- PENDING ANNOUNCEMENTS ---------------- */}
            {activeTab === 'pending-announcements' && (
              <ResponsiveList
                emptyText="No pending announcements"
                items={pendingAnnouncements}
                renderItem={(announcement: any) => (
                  <AnnouncementPendingCard
                    announcement={announcement}
                    onApprove={() => {
                      setSelectedAnnouncement(announcement);
                      setShowBatchModal(true);
                    }}
                    onReject={() => {
                      setSelectedAnnouncement(announcement);
                      setShowRejectModal(true);
                    }}
                  />
                )}
              />
            )}

            {/* ---------------- ALL ANNOUNCEMENTS ---------------- */}
            {activeTab === 'announcements' && (
              <ResponsiveList
                emptyText="No announcements yet"
                items={announcements}
                renderItem={(announcement: any) => (
                  <AnnouncementCard
                    announcement={announcement}
                    onDelete={() => {
                      setSelectedAnnouncement(announcement);
                      setShowDeleteModal(true);
                    }}
                  />
                )}
              />
            )}
          </>
        )}

        {/* ---------------- MODALS ---------------- */}
        <Modals
          showApproveModal={showApproveModal}
          setShowApproveModal={setShowApproveModal}
          selectedStudent={selectedStudent}
          mentors={mentors}
          selectedMentor={selectedMentor}
          setSelectedMentor={setSelectedMentor}
          handleApprove={handleApprove}
          isApproving={isApproving}
          showBatchModal={showBatchModal}
          setShowBatchModal={setShowBatchModal}
          availableBatches={availableBatches}
          selectedBatches={selectedBatches}
          toggleBatch={toggleBatch}
          handleApproveAnnouncement={handleApproveAnnouncement}
          isApprovingAnnouncement={isApprovingAnnouncement}
          showRejectModal={showRejectModal}
          setShowRejectModal={setShowRejectModal}
          rejectionRemarks={rejectionRemarks}
          setRejectionRemarks={setRejectionRemarks}
          handleRejectAnnouncement={handleRejectAnnouncement}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          selectedAnnouncement={selectedAnnouncement}
          handleDeleteAnnouncement={handleDeleteAnnouncement}
          isDeletingAnnouncement={isDeletingAnnouncement}
          showBroadcastModal={showBroadcastModal}
          setShowBroadcastModal={setShowBroadcastModal}
          handleSendAnnouncement={handleSendAnnouncement}
          showAddMentorModal={showAddMentorModal}
          setShowAddMentorModal={setShowAddMentorModal}

          loadData={loadData}
          showRejectStudentModal={showRejectStudentModal}
          setShowRejectStudentModal={setShowRejectStudentModal}

          handleRejectStudent={handleRejectStudent}
          isRejectingStudent={isRejectingStudent}
        />

      </div>
    </div >
  );
}

/* --------------------------------------------------------------
   REUSABLE COMPONENTS FOR CLEAN, RESPONSIVE UI
-------------------------------------------------------------- */

function DashboardCard({ title, count, colors, icon: Icon, stats = [] }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className={`text-5xl font-bold bg-gradient-to-r ${colors} bg-clip-text text-transparent`}>
            {count}
          </p>
        </div>
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colors} shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {stats.map((s: any) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${s.color === 'green' ? 'bg-green-500' : s.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-600">{s.label}</span>
              </div>
              <span className="font-semibold">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResponsiveList({ items, emptyText, renderItem }: any) {
  if (!items.length)
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-lg font-medium text-gray-900">{emptyText}</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {items.map(renderItem)}
    </div>
  );
}

/* --------------------------------------------------------------
   CUSTOM CARDS
-------------------------------------------------------------- */

function StudentPendingCard({ student, onApprove, onReject }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4
    flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">
          {student.firstName} {student.lastName}
        </h3>
        <p className="text-sm text-gray-600">{student.email}</p>
        <p className="text-xs text-gray-500">
          {student.college} • {student.city} • Batch {student.batchYear}
        </p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onApprove}
          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function AnnouncementPendingCard({ announcement, onApprove, onReject }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">
          {announcement.author?.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold">{announcement.title}</h3>
          <p className="text-sm text-gray-600">
            {announcement.author?.name} · {announcement.author?.email}
          </p>
          <p className="text-xs text-gray-500">
            {announcement.author?.college} · Batch {announcement.author?.batchYear}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{announcement.content}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onApprove}
          className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Approve
        </button>

        <button
          onClick={onReject}
          className="px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function AnnouncementCard({ announcement, onDelete }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
            {announcement.authorName
              ?.split(' ')
              ?.map((n: string) => n[0])
              ?.join('')
              ?.slice(0, 2) || 'AN'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold">{announcement.title}</h3>
            <p className="text-sm text-gray-600">By {announcement.authorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
              ${announcement.status?.toLowerCase() === 'approved'
                ? 'bg-green-100 text-green-800'
                : announcement.status?.toLowerCase() === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }
            `}
          >
            {announcement.status}
          </span>

          <button className="text-red-600 hover:text-red-800" onClick={onDelete}>
            ✕
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{announcement.content}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------
   MODALS WRAPPER — unchanged, only grouped for clarity
-------------------------------------------------------------- */

function Modals(props: any) {
  const [mentorSearch, setMentorSearch] = useState('');

  // Reset search when modal opens/closes or mentor list changes
  useEffect(() => {
    if (props.showApproveModal) {
      setMentorSearch('');
    }
  }, [props.showApproveModal]);

  const filteredMentors = (props.mentors || []).filter((m: any) => {
    const term = mentorSearch.toLowerCase();
    const name = `${m.firstName} ${m.lastName}`.toLowerCase();
    const email = (m.email || '').toLowerCase();
    return (name.includes(term) || email.includes(term)) && m.status === 'ACTIVE';
  });

  return (
    <>
      <Modal
        isOpen={props.showApproveModal}
        onClose={() => props.setShowApproveModal(false)}
        title="Approve Student"
      >
        <div className="space-y-4">
          <p>
            Approve <strong>{props.selectedStudent?.firstName} {props.selectedStudent?.lastName}</strong> and
            assign a mentor:
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Find Mentor</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={mentorSearch}
                onChange={(e) => setMentorSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Select Mentor</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              value={props.selectedMentor}
              onChange={(e) => props.setSelectedMentor(e.target.value)}
            >
              <option value="">Choose a mentor...</option>
              {filteredMentors.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.email})
                </option>
              ))}
              {filteredMentors.length === 0 && (
                <option disabled>No mentors found</option>
              )}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={props.handleApprove}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={!props.selectedMentor || props.isApproving}
            >
              {props.isApproving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </button>
            <button
              onClick={() => props.setShowApproveModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={props.isApproving}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={props.showBatchModal}
        onClose={() => props.setShowBatchModal(false)}
        title="Choose batches to publish to"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {props.availableBatches.map((b: number) => (
              <button
                key={b}
                onClick={() => props.toggleBatch(b)}
                className={`px-3 py-2 rounded-lg border ${props.selectedBatches.includes(b) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={props.handleApproveAnnouncement}
              className="btn btn-primary flex-1 inline-flex items-center justify-center gap-2"
              disabled={props.isApprovingAnnouncement}
            >
              {props.isApprovingAnnouncement ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Approving...
                </>
              ) : (
                'Approve & Send'
              )}
            </button>
            <button onClick={() => props.setShowBatchModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={props.showRejectModal}
        onClose={() => props.setShowRejectModal(false)}
        title="Reject announcement"
      >
        <div className="space-y-4">
          <p>Provide remarks explaining why the announcement is rejected:</p>
          <textarea className="input h-28" value={props.rejectionRemarks} onChange={(e) => props.setRejectionRemarks(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={props.handleRejectAnnouncement} className="btn btn-danger flex-1">
              Reject
            </button>
            <button onClick={() => props.setShowRejectModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={props.showDeleteModal}
        onClose={() => props.setShowDeleteModal(false)}
        title="Delete announcement"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this announcement?</p>
          <div className="flex gap-3">
            <button
              onClick={props.handleDeleteAnnouncement}
              className="btn btn-danger flex-1 inline-flex items-center justify-center gap-2"
              disabled={props.isDeletingAnnouncement}
            >
              {props.isDeletingAnnouncement ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button onClick={() => props.setShowDeleteModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <BroadcastModal
        isOpen={props.showBroadcastModal}
        onClose={() => props.setShowBroadcastModal(false)}
        onSend={props.handleSendAnnouncement}
        title="Send Portal-Wide Announcement"
      />

      <AddMentorModal
        isOpen={props.showAddMentorModal}
        onClose={() => props.setShowAddMentorModal(false)}
        onSuccess={() => {
          props.setShowAddMentorModal(false);
          props.loadData(true);
        }}
      />

      <Modal
        isOpen={props.showRejectStudentModal}
        onClose={() => props.setShowRejectStudentModal(false)}
        title="Reject Student Request"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to reject <strong>{props.selectedStudent?.firstName} {props.selectedStudent?.lastName}</strong>?
            This will delete their account request permanently.
          </p>
          <div className="flex gap-3">
            <button
              onClick={props.handleRejectStudent}
              disabled={props.isRejectingStudent}
              className="btn btn-danger flex-1 flex justify-center items-center gap-2"
            >
              {props.isRejectingStudent ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rejecting...
                </>
              ) : (
                'Reject & Delete'
              )}
            </button>
            <button
              onClick={() => props.setShowRejectStudentModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
