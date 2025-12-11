// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';
import AddMentorModal from '../components/AddMentorModal';
import StudentsSection from '../components/admin/StudentsSection';
import MentorsSection from '../components/admin/MentorsSection';
import { StatisticsSkeleton, ListSkeleton } from '../components/DashboardSkeleton';
import {
  Plus,
  Megaphone,
  BarChart3,
  Clock,
  Users,
  UserCog,
  Bell,
  Volume2,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'statistics' | 'pending' | 'students' | 'mentors' | 'pending-announcements' | 'announcements'>('statistics');

  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);

  // modals & selection
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
  const [availableBatches, setAvailableBatches] = useState<number[]>([]);

  // track loaded tabs to avoid refetching unnecessarily
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async (forceRefresh = false) => {
    // Skip loading if data already loaded and not forcing refresh
    if (!forceRefresh && loadedTabs.has(activeTab)) return;

    setLoading(true);
    try {
      if (activeTab === 'statistics') {
        const data = await adminAPI.getStatistics();
        setStatistics(data);
      } else if (activeTab === 'pending') {
        const data = await adminAPI.getPendingStudents();
        setPendingStudents(data || []);
        if (mentors.length === 0) {
          const mentorData = await adminAPI.getAllMentors();
          setMentors(mentorData || []);
        }
      } else if (activeTab === 'students') {
        const data = await adminAPI.getAllStudents();
        setAllStudents(data || []);
        if (mentors.length === 0) {
          const mentorData = await adminAPI.getAllMentors();
          setMentors(mentorData || []);
        }
      } else if (activeTab === 'mentors') {
        const data = await adminAPI.getAllMentors();
        setMentors(data || []);
      } else if (activeTab === 'pending-announcements') {
        const data = await adminAPI.getPendingAnnouncements();
        setPendingAnnouncements(data || []);
        if (availableBatches.length === 0) {
          const batches = await adminAPI.getBatchYears();
          setAvailableBatches(batches || []);
        }
      } else if (activeTab === 'announcements') {
        const data = await adminAPI.getAllAnnouncements();
        setAnnouncements(data || []);
      }

      // mark this tab loaded
      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.add(activeTab);
        return next;
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Actions ---------- */

  // approve student (assign mentor)
  const handleApprove = async () => {
    if (!selectedStudent) return;
    try {
      await adminAPI.approveStudent(selectedStudent.id, selectedMentor);
      setShowApproveModal(false);
      setSelectedStudent(null);
      setSelectedMentor('');

      // force refresh pending/students tabs
      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete('pending');
        next.delete('students');
        return next;
      });
      loadData(true);
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  // optimistic block/unblock — update local state quickly, fallback reload on error
  const handleBlockUser = async (userId: string) => {
    try {
      // optimistic update
      setAllStudents(prev => prev.map(s => s.id === userId ? { ...s, status: 'BLOCKED' } : s));
      setMentors(prev => prev.map(m => m.id === userId ? { ...m, status: 'BLOCKED' } : m));

      await adminAPI.blockUser(userId);
    } catch (error) {
      console.error('Error blocking user:', error);
      // fallback: refresh current tab
      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete(activeTab);
        return next;
      });
      loadData(true);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      // optimistic update
      setAllStudents(prev => prev.map(s => s.id === userId ? { ...s, status: 'ACTIVE' } : s));
      setMentors(prev => prev.map(m => m.id === userId ? { ...m, status: 'ACTIVE' } : m));

      await adminAPI.unblockUser(userId);
    } catch (error) {
      console.error('Error unblocking user:', error);
      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete(activeTab);
        return next;
      });
      loadData(true);
    }
  };

  // Approve announcement — send to selected batches (or all if none)
  const handleApproveAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    try {
      await adminAPI.approveAnnouncement(selectedAnnouncement.id, selectedBatches);
      setShowBatchModal(false);
      setSelectedAnnouncement(null);
      setSelectedBatches([]);

      // refresh pending ann & announcements
      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete('pending-announcements');
        next.delete('announcements');
        return next;
      });
      loadData(true);
    } catch (error) {
      console.error('Error approving announcement:', error);
    }
  };

  const handleRejectAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    if (!rejectionRemarks.trim()) {
      alert('Please provide rejection remarks');
      return;
    }
    try {
      await adminAPI.rejectAnnouncement(selectedAnnouncement.id, rejectionRemarks);
      setShowRejectModal(false);
      setSelectedAnnouncement(null);
      setRejectionRemarks('');

      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete('pending-announcements');
        next.delete('announcements');
        return next;
      });
      loadData(true);
    } catch (error) {
      console.error('Error rejecting announcement:', error);
    }
  };

  const handleSendAnnouncement = async (title: string, content: string) => {
    try {
      await adminAPI.sendBroadcast(title, content);
      setShowBroadcastModal(false);

      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete('announcements');
        return next;
      });

      if (activeTab === 'announcements') loadData(true);
    } catch (error) {
      console.error('Error sending announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    try {
      await adminAPI.deleteAnnouncement(selectedAnnouncement.id);
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);

      setLoadedTabs(prev => {
        const next = new Set(prev);
        next.delete('announcements');
        return next;
      });
      loadData(true);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const toggleBatch = (batch: number) => {
    setSelectedBatches(prev => prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]);
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your platform with ease</p>
          </div>

          <div className="flex space-x-3">
            {activeTab === 'mentors' && (
              <button
                onClick={() => setShowAddMentorModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-150 border border-gray-300 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                Add Mentor
              </button>
            )}

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
            >
              <Megaphone className="h-5 w-5" />
              Send Announcement
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <nav className="flex flex-wrap justify-center gap-4 place-content-center">
            {[
              { id: 'statistics', label: 'Statistics', Icon: BarChart3 },
              { id: 'pending', label: 'Pending Students', Icon: Clock },
              { id: 'students', label: 'Students', Icon: Users },
              { id: 'mentors', label: 'Mentors', Icon: UserCog },
              { id: 'pending-announcements', label: 'Pending Announcements', Icon: Bell },
              { id: 'announcements', label: 'Announcements', Icon: Volume2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <>
            {activeTab === 'statistics' && <StatisticsSkeleton />}
            {(activeTab === 'pending' || activeTab === 'students' || activeTab === 'mentors' || activeTab === 'announcements' || activeTab === 'pending-announcements') && <ListSkeleton />}
          </>
        ) : (
          <>
            {/* STATISTICS */}
            {activeTab === 'statistics' && statistics && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Students */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Students</h3>
                        <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {statistics.students.total}
                        </p>
                      </div>
                      <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">Active</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{statistics.students.active}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-gray-600">Pending</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{statistics.students.pending}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mentors */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Mentors</h3>
                        <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {statistics.mentors.total}
                        </p>
                      </div>
                      <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCog className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Guiding students to success</p>
                    </div>
                  </div>

                  {/* Announcements */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Announcements</h3>
                        <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {statistics.announcements.total}
                        </p>
                      </div>
                      <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Volume2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-gray-600">Pending</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{statistics.announcements.pending}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">Approved</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{statistics.announcements.approved}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending students */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending students</p>
                ) : (
                  pendingStudents.map(student => (
                    <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{student.firstName} {student.lastName}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-500">{student.college} • {student.city} • Batch {student.batchYear}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedStudent(student); setShowApproveModal(true); }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Students list / management */}
            {activeTab === 'students' && (
              <StudentsSection
                students={allStudents}
                mentors={mentors}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
              />
            )}

            {/* Mentors list / management */}
            {activeTab === 'mentors' && (
              <MentorsSection
                mentors={mentors}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
                onAddMentor={() => setShowAddMentorModal(true)}
              />
            )}

            {/* Pending announcements */}
            {activeTab === 'pending-announcements' && (
              <div className="space-y-4">
                {pendingAnnouncements.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                    <p className="text-lg font-medium text-gray-900 mb-1">No pending announcements</p>
                    <p className="text-sm text-gray-500">All announcements have been reviewed</p>
                  </div>
                ) : (
                  pendingAnnouncements.map(announcement => (
                    <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {(announcement.author?.name || 'AN').split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <span className="font-medium">{announcement.author?.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{announcement.author?.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{announcement.author?.college}</span>
                            <span className="text-gray-400">•</span>
                            <span>Batch {announcement.author?.batchYear}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => { setSelectedAnnouncement(announcement); setSelectedBatches([]); setShowBatchModal(true); }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-150 shadow-sm hover:shadow"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => { setSelectedAnnouncement(announcement); setRejectionRemarks(''); setShowRejectModal(true); }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-150 border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Announcements (approved / all) */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                    <p className="text-lg font-medium text-gray-900 mb-1">No announcements yet</p>
                    <p className="text-sm text-gray-500">Approved announcements will appear here</p>
                  </div>
                ) : (
                  announcements.map(announcement => (
                    <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(announcement.authorName || announcement.author || 'AN').toString().split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</h3>
                            <p className="text-sm text-gray-600">By {announcement.authorName || announcement.author}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${announcement.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' : announcement.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20' : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'}`}>
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${announcement.status?.toLowerCase() === 'approved' ? 'bg-green-600' : announcement.status?.toLowerCase() === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'}`}></span>
                            {announcement.status}
                          </span>

                          <button
                            onClick={() => { setSelectedAnnouncement(announcement); setShowDeleteModal(true); }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete announcement"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                      </div>

                      {announcement.approver && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Reviewed by {announcement.approver}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Approve student modal */}
        <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve Student">
          <div className="space-y-4">
            <p>Approve <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong> and assign a mentor:</p>

            <div>
              <label className="label">Select Mentor</label>
              <select className="input" value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                <option value="">Choose a mentor...</option>
                {mentors.filter(m => m.status?.toUpperCase() === 'ACTIVE').map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button onClick={handleApprove} disabled={!selectedMentor} className="btn btn-primary flex-1">Approve</button>
              <button onClick={() => setShowApproveModal(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </Modal>

        {/* Batch select modal for announcement approval */}
        <Modal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} title="Select Target Batches">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select which batches should see this announcement. Leave empty to show to all students.</p>

            <div className="space-y-2">
              {availableBatches.map(batch => (
                <label key={batch} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={selectedBatches.includes(batch)} onChange={() => toggleBatch(batch)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span>Batch {batch}</span>
                </label>
              ))}
            </div>

            {selectedBatches.length > 0 ? (
              <p className="text-sm text-blue-600">Will be visible to: Batch {selectedBatches.sort((a,b)=>a-b).join(', ')}</p>
            ) : (
              <p className="text-sm text-green-600">Will be visible to: All students</p>
            )}

            <div className="flex space-x-3 pt-4">
              <button onClick={handleApproveAnnouncement} className="btn btn-primary flex-1">Approve</button>
              <button onClick={() => setShowBatchModal(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </Modal>

        {/* Reject announcement modal */}
        <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Announcement">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Please provide a reason for rejecting this announcement. The student will be notified.</p>
            <div>
              <label className="label">Rejection Remarks</label>
              <textarea className="input" rows={4} value={rejectionRemarks} onChange={(e) => setRejectionRemarks(e.target.value)} placeholder="Enter reason for rejection..." />
            </div>
            <div className="flex space-x-3">
              <button onClick={handleRejectAnnouncement} className="btn btn-primary flex-1">Reject</button>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </Modal>

        {/* Delete announcement modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Announcement">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Are you sure you want to delete the announcement <strong>"{selectedAnnouncement?.title}"</strong> ?</p>
            <p className="text-sm text-red-600">This action cannot be undone. The announcement will be permanently removed.</p>
            <div className="flex space-x-3">
              <button onClick={handleDeleteAnnouncement} className="btn btn-primary flex-1 bg-red-600 hover:bg-red-700">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </Modal>

        {/* Broadcast modal */}
        <BroadcastModal isOpen={showBroadcastModal} onClose={() => setShowBroadcastModal(false)} onSend={handleSendAnnouncement} title="Send Portal-Wide Announcement" />

        {/* Add mentor modal */}
        <AddMentorModal isOpen={showAddMentorModal} onClose={() => setShowAddMentorModal(false)} onSuccess={() => { setShowAddMentorModal(false); loadData(true); }} />
      </div>
    </div>
  );
}
