import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';
import AddMentorModal from '../components/AddMentorModal';
import StudentsSection from '../components/admin/StudentsSection';
import MentorsSection from '../components/admin/MentorsSection';
import { StatisticsSkeleton, ListSkeleton } from '../components/DashboardSkeleton';

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
            // Force refresh current tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab);
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await adminAPI.unblockUser(userId);
            // Force refresh current tab
            setLoadedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab);
                return newSet;
            });
            loadData(true);
        } catch (error) {
            console.error('Error unblocking user:', error);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex space-x-3">
                    {activeTab === 'mentors' && (
                        <button
                            onClick={() => setShowAddMentorModal(true)}
                            className="btn btn-secondary"
                        >
                            Add Mentor
                        </button>
                    )}
                    <button onClick={() => setShowBroadcastModal(true)} className="btn btn-primary">
                        Send Portal Announcement
                    </button>
                </div>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['statistics', 'pending', 'students', 'mentors', 'pending-announcements', 'announcements'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab === 'pending' ? 'Pending Students' :
                                tab === 'pending-announcements' ? 'Pending Announcements' :
                                    tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                                <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Students</h3>
                                    <p className="text-4xl font-bold text-blue-600">{statistics.students.total}</p>
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Active: {statistics.students.active}</p>
                                        <p>Pending: {statistics.students.pending}</p>
                                    </div>
                                </div>

                                <div className="card bg-gradient-to-br from-green-50 to-green-100">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Mentors</h3>
                                    <p className="text-4xl font-bold text-green-600">{statistics.mentors.total}</p>
                                </div>

                                <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Announcements</h3>
                                    <p className="text-4xl font-bold text-purple-600">{statistics.announcements.total}</p>
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Pending: {statistics.announcements.pending}</p>
                                        <p>Approved: {statistics.announcements.approved}</p>
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
                                <p className="text-gray-500 text-center py-8">No pending announcements</p>
                            ) : (
                                pendingAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="card">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1">{announcement.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    By {announcement.author.name} ({announcement.author.email})
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {announcement.author.college} • Batch {announcement.author.batchYear}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedAnnouncement(announcement);
                                                    setSelectedBatches([]);
                                                    setShowBatchModal(true);
                                                }}
                                                className="btn btn-primary"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedAnnouncement(announcement);
                                                    setRejectionRemarks('');
                                                    setShowRejectModal(true);
                                                }}
                                                className="btn btn-secondary"
                                            >
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
                                    <p className="text-gray-700 mb-2">{announcement.content}</p>
                                    <p className="text-sm text-gray-500">By {announcement.author}</p>
                                    {announcement.approver && (
                                        <p className="text-sm text-gray-500">Reviewed by {announcement.approver}</p>
                                    )}
                                </div>
                            ))}
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