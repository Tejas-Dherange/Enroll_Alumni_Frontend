import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('statistics');
    const [pendingStudents, setPendingStudents] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [mentors, setMentors] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedMentor, setSelectedMentor] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'statistics') {
                const data = await adminAPI.getStatistics();
                setStatistics(data);
            } else if (activeTab === 'pending') {
                const data = await adminAPI.getPendingStudents();
                setPendingStudents(data);
                const mentorData = await adminAPI.getAllMentors();
                setMentors(mentorData);
            } else if (activeTab === 'students') {
                const data = await adminAPI.getAllStudents();
                setAllStudents(data);
            } else if (activeTab === 'mentors') {
                const data = await adminAPI.getAllMentors();
                setMentors(data);
            } else if (activeTab === 'announcements') {
                const data = await adminAPI.getAllAnnouncements();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedStudent || !selectedMentor) return;
        try {
            await adminAPI.approveStudent(selectedStudent.id, selectedMentor);
            setShowApproveModal(false);
            loadData();
        } catch (error) {
            console.error('Failed to approve student:', error);
        }
    };

    const handleBlockUser = async (userId: string) => {
        if (!confirm('Are you sure you want to block this user?')) return;
        try {
            await adminAPI.blockUser(userId);
            loadData();
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await adminAPI.unblockUser(userId);
            loadData();
        } catch (error) {
            console.error('Failed to unblock user:', error);
        }
    };

    const handleSendAnnouncement = async (title: string, content: string, sendEmail: boolean, sendSMS: boolean) => {
        await adminAPI.sendAnnouncement(title, content, sendEmail, sendSMS);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button onClick={() => setShowBroadcastModal(true)} className="btn btn-primary">
                    Send Portal Announcement
                </button>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['statistics', 'pending', 'students', 'mentors', 'announcements'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab === 'pending' ? 'Pending Students' : tab}
                        </button>
                    ))}
                </nav>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'statistics' && statistics && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
                                    <p className="text-4xl font-bold text-blue-600">{statistics.users.total}</p>
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Students: {statistics.users.students}</p>
                                        <p>Mentors: {statistics.users.mentors}</p>
                                    </div>
                                </div>

                                <div className="card bg-gradient-to-br from-green-50 to-green-100">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Students</h3>
                                    <p className="text-4xl font-bold text-green-600">{statistics.users.activeStudents}</p>
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Pending: {statistics.users.pendingStudents}</p>
                                        <p>Blocked: {statistics.users.blocked}</p>
                                    </div>
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.college}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${student.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                        student.status?.toUpperCase() === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.mentor?.name || 'Not assigned'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {student.status?.toUpperCase() === 'BLOCKED' ? (
                                                    <button
                                                        onClick={() => handleUnblockUser(student.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBlockUser(student.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'mentors' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mentors.map((mentor) => (
                                        <tr key={mentor.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {mentor.firstName} {mentor.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentor.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${mentor.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                        mentor.status?.toUpperCase() === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {mentor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {mentor.status?.toUpperCase() === 'BLOCKED' ? (
                                                    <button
                                                        onClick={() => handleUnblockUser(mentor.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBlockUser(mentor.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
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

            <BroadcastModal
                isOpen={showBroadcastModal}
                onClose={() => setShowBroadcastModal(false)}
                onSend={handleSendAnnouncement}
                title="Send Portal-Wide Announcement"
            />
        </div>
    );
}
