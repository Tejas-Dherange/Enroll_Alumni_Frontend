import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';
import AddMentorModal from '../components/AddMentorModal';
import StudentsSection from '../components/admin/StudentsSection';
import MentorsSection from '../components/admin/MentorsSection';
import { StatisticsSkeleton, ListSkeleton } from '../components/DashboardSkeleton';
import { Plus, Megaphone, BarChart3, Clock, Users, UserCog, Bell, Volume2 } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('statistics');
    const [pendingStudents, setPendingStudents] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [mentors, setMentors] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [rejectionRemarks, setRejectionRemarks] = useState('');
    const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
    const [availableBatches, setAvailableBatches] = useState<number[]>([]);
    const [showAddMentorModal, setShowAddMentorModal] = useState(false);

    // Track what data has been loaded to avoid refetching
    const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async (forceRefresh = false) => {
        // Skip loading if data already loaded and not forcing refresh
        if (!forceRefresh && loadedTabs.has(activeTab)) {
            return;
        }

        setLoading(true);
        try {
            if (activeTab === 'statistics') {
                const data = await adminAPI.getStatistics();
                setStatistics(data);
            } else if (activeTab === 'pending') {
                const data = await adminAPI.getPendingStudents();
                setPendingStudents(data);
                // Only fetch mentors if not already loaded
                if (mentors.length === 0) {
                    const mentorData = await adminAPI.getAllMentors();
                    setMentors(mentorData);
                }
            } else if (activeTab === 'students') {
                const data = await adminAPI.getAllStudents();
                setAllStudents(data);
                // Only fetch mentors if not already loaded
                if (mentors.length === 0) {
                    const mentorData = await adminAPI.getAllMentors();
                    setMentors(mentorData);
                }
            } else if (activeTab === 'mentors') {
                const data = await adminAPI.getAllMentors();
                setMentors(data);
            } else if (activeTab === 'announcements') {
                const data = await adminAPI.getAllAnnouncements();
                setAnnouncements(data);
            } else if (activeTab === 'pending-announcements') {
                const data = await adminAPI.getPendingAnnouncements();
                setPendingAnnouncements(data);
                // Only fetch batches if not already loaded
                if (availableBatches.length === 0) {
                    const batches = await adminAPI.getBatchYears();
                    setAvailableBatches(batches);
                }
            }

            // Mark this tab as loaded
            setLoadedTabs(prev => new Set(prev).add(activeTab));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await adminAPI.approveStudent(selectedStudent.id, selectedMentor);
            setShowApproveModal(false);
            setSelectedStudent(null);
            setSelectedMentor('');
            // Force refresh current tab data
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab);
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error approving student:', error);
        }
    };

    const handleBlockUser = async (userId: string) => {
        try {
            await adminAPI.blockUser(userId);
            // Optimistically update the local state instead of reloading all data
            setAllStudents(prev => prev.map(student =>
                student.id === userId ? { ...student, status: 'BLOCKED' } : student
            ));
            setMentors(prev => prev.map(mentor =>
                mentor.id === userId ? { ...mentor, status: 'BLOCKED' } : mentor
            ));
            // Force refresh current tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab);
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error blocking user:', error);
            // Optionally reload data on error to ensure consistency
            loadData();
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await adminAPI.unblockUser(userId);
            // Optimistically update the local state instead of reloading all data
            setAllStudents(prev => prev.map(student =>
                student.id === userId ? { ...student, status: 'ACTIVE' } : student
            ));
            setMentors(prev => prev.map(mentor =>
                mentor.id === userId ? { ...mentor, status: 'ACTIVE' } : mentor
            ));
            // Force refresh current tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab);
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error unblocking user:', error);
            // Optionally reload data on error to ensure consistency
            loadData();
        }
    };

    const handleApproveAnnouncement = async () => {
        try {
            await adminAPI.approveAnnouncement(selectedAnnouncement.id, selectedBatches);
            setShowBatchModal(false);
            setSelectedAnnouncement(null);
            setSelectedBatches([]);
            // Force refresh announcement tabs
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('pending-announcements');
                newSet.delete('announcements');
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error approving announcement:', error);
        }
    };

    const handleRejectAnnouncement = async () => {
        if (!rejectionRemarks.trim()) {
            alert('Please provide rejection remarks');
            return;
        }
        try {
            await adminAPI.rejectAnnouncement(selectedAnnouncement.id, rejectionRemarks);
            setShowRejectModal(false);
            setSelectedAnnouncement(null);
            setRejectionRemarks('');
            // Force refresh announcement tabs
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('pending-announcements');
                newSet.delete('announcements');
                return newSet;
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
            // Force refresh announcements tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('announcements');
                return newSet;
            });
            if (activeTab === 'announcements') {
                loadData(true);
            }
        } catch (error) {
            console.error('Error sending announcement:', error);
        }
    };

    const handleDeleteAnnouncement = async () => {
        try {
            await adminAPI.deleteAnnouncement(selectedAnnouncement.id);
            setShowDeleteModal(false);
            setSelectedAnnouncement(null);
            // Force refresh announcements tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('announcements');
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const toggleBatch = (batch: number) => {
        setSelectedBatches(prev =>
            prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
        );
    };

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

                {/* Tab Navigation */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                    <nav className="flex flex-wrap gap-2">
                        {[
                            { id: 'statistics', label: 'Statistics', Icon: BarChart3 },
                            { id: 'pending', label: 'Pending Students', Icon: Clock },
                            { id: 'students', label: 'Students', Icon: Users },
                            { id: 'mentors', label: 'Mentors', Icon: UserCog },
                            { id: 'pending-announcements', label: 'Pending Announcements', Icon: Bell },
                            { id: 'announcements', label: 'Announcements', Icon: Volume2 }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                        {activeTab === 'statistics' && statistics && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Students Card */}
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

                                    {/* Mentors Card */}
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

                                    {/* Announcements Card */}
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

                        {activeTab === 'pending' && (
                            <div className="space-y-4">
                                {pendingStudents.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No pending students</p>
                                ) : (
                                    pendingStudents.map((student) => (
                                        <div key={student.id} className="card flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {student.firstName} {student.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                                <p className="text-sm text-gray-500">
                                                    {student.college} • {student.city} • Batch {student.batchYear}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowApproveModal(true);
                                                }}
                                                className="btn btn-primary"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'students' && (
                            <StudentsSection
                                students={allStudents}
                                mentors={mentors}
                                onBlockUser={handleBlockUser}
                                onUnblockUser={handleUnblockUser}
                            />
                        )}

                        {activeTab === 'mentors' && (
                            <MentorsSection
                                mentors={mentors}
                                onBlockUser={handleBlockUser}
                                onUnblockUser={handleUnblockUser}
                                onAddMentor={() => setShowAddMentorModal(true)}
                            />
                        )}

                        {activeTab === 'pending-announcements' && (
                            <div className="space-y-4">
                                {pendingAnnouncements.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900 mb-1">No pending announcements</p>
                                            <p className="text-sm text-gray-500">All announcements have been reviewed</p>
                                        </div>
                                    </div>
                                ) : (
                                    pendingAnnouncements.map((announcement) => (
                                        <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-start gap-4 mb-4">
                                                {/* Author Avatar */}
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-base">
                                                        {announcement.author.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AN'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium">{announcement.author.name}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span>{announcement.author.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                                        </svg>
                                                        <span>{announcement.author.college}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span>Batch {announcement.author.batchYear}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAnnouncement(announcement);
                                                        setSelectedBatches([]);
                                                        setShowBatchModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-150 shadow-sm hover:shadow"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedAnnouncement(announcement);
                                                        setRejectionRemarks('');
                                                        setShowRejectModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-150 border border-red-200"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'announcements' && (
                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900 mb-1">No announcements yet</p>
                                            <p className="text-sm text-gray-500">Approved announcements will appear here</p>
                    {activeTab === 'announcements' && (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${announcement.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                announcement.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {announcement.status}
                                            </span>
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
                                        </div>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Author Avatar */}
                                                    <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {announcement.author?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AN'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</h3>
                                                        <p className="text-sm text-gray-600">By {announcement.author}</p>
                                                    </div>
                                                </div>
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${announcement.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' :
                                                    announcement.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20' :
                                                        'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
                                                    }`}>
                                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${announcement.status?.toLowerCase() === 'approved' ? 'bg-green-600' :
                                                        announcement.status?.toLowerCase() === 'rejected' ? 'bg-red-600' :
                                                            'bg-yellow-600'
                                                        }`}></span>
                                                    {announcement.status}
                                                </span>
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

                <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve Student">
                    <div className="space-y-4">
                        <p>
                            Approve <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong> and assign a mentor:
                        </p>
                        <div>
                            <label className="label">Select Mentor</label>
                            <select
                                className="input"
                                value={selectedMentor}
                                onChange={(e) => setSelectedMentor(e.target.value)}
                            >
                                <option value="">Choose a mentor...</option>
                                {mentors.filter(m => m.status?.toUpperCase() === 'ACTIVE').map((mentor) => (
                                    <option key={mentor.id} value={mentor.id}>
                                        {mentor.firstName} {mentor.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={handleApprove} disabled={!selectedMentor} className="btn btn-primary flex-1">
                                Approve
                            </button>
                            <button onClick={() => setShowApproveModal(false)} className="btn btn-secondary flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} title="Select Target Batches">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Select which batches should see this announcement. Leave empty to show to all students.
                        </p>
                        <div className="space-y-2">
                            {availableBatches.map((batch) => (
                                <label key={batch} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedBatches.includes(batch)}
                                        onChange={() => toggleBatch(batch)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span>Batch {batch}</span>
                                </label>
                            ))}
                        </div>
                        {selectedBatches.length > 0 && (
                            <p className="text-sm text-blue-600">
                                Will be visible to: Batch {selectedBatches.sort((a, b) => a - b).join(', ')}
                            </p>
                        )}
                        {selectedBatches.length === 0 && (
                            <p className="text-sm text-green-600">
                                Will be visible to: All students
                            </p>
                        )}
                        <div className="flex space-x-3 pt-4">
                            <button onClick={handleApproveAnnouncement} className="btn btn-primary flex-1">
                                Approve
                            </button>
                            <button onClick={() => setShowBatchModal(false)} className="btn btn-secondary flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Announcement">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Please provide a reason for rejecting this announcement. The student will be notified.
                        </p>
                        <div>
                            <label className="label">Rejection Remarks</label>
                            <textarea
                                className="input"
                                rows={4}
                                value={rejectionRemarks}
                                onChange={(e) => setRejectionRemarks(e.target.value)}
                                placeholder="Enter reason for rejection..."
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={handleRejectAnnouncement} className="btn btn-primary flex-1">
                                Reject
                            </button>
                            <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>

                <BroadcastModal
                    isOpen={showBroadcastModal}
                    onClose={() => setShowBroadcastModal(false)}
                    onSend={handleSendAnnouncement}
                    title="Send Portal-Wide Announcement"
                />

                <AddMentorModal
                    isOpen={showAddMentorModal}
                    onClose={() => setShowAddMentorModal(false)}
                    onSuccess={() => {
                        setShowAddMentorModal(false);
                        loadData();
                    }}
                />
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

            <BroadcastModal
                isOpen={showBroadcastModal}
                onClose={() => setShowBroadcastModal(false)}
                onSend={handleSendAnnouncement}
                title="Send Portal-Wide Announcement"
            />

            <AddMentorModal
                isOpen={showAddMentorModal}
                onClose={() => setShowAddMentorModal(false)}
                onSuccess={() => {
                    setShowAddMentorModal(false);
                    loadData();
                }}
            />
        </div>
    );
}