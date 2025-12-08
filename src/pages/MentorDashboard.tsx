import { useEffect, useState } from 'react';
import { mentorAPI } from '../api/mentor';
import Modal from '../components/Modal';
import BroadcastModal from '../components/BroadcastModal';

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastTarget, setBroadcastTarget] = useState<'students' | 'mentors'>('students');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [rejectionRemarks, setRejectionRemarks] = useState('');
    const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
    const [availableBatches, setAvailableBatches] = useState<number[]>([]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending') {
                const data = await mentorAPI.getPendingAnnouncements();
                setPendingAnnouncements(data);
            } else if (activeTab === 'students') {
                const data = await mentorAPI.getAssignedStudents();
                setStudents(data);
                // Get unique batch years from students
                const batches = [...new Set(data.map((s: any) => s.batchYear as number))].sort((a: number, b: number) => b - a);
                setAvailableBatches(batches as number[]);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClick = (announcement: any) => {
        setSelectedAnnouncement(announcement);
        setSelectedBatches([]);
        setShowApproveModal(true);
    };

    const handleApprove = async () => {
        if (!selectedAnnouncement) return;
        try {
            await mentorAPI.approveAnnouncement(selectedAnnouncement.id, selectedBatches.length > 0 ? selectedBatches : undefined);
            setShowApproveModal(false);
            setSelectedBatches([]);
            loadData();
        } catch (error) {
            console.error('Failed to approve:', error);
        }
    };

    const toggleBatch = (batch: number) => {
        setSelectedBatches(prev =>
            prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
        );
    };

    const handleReject = async () => {
        if (!selectedAnnouncement) return;

        if (!rejectionRemarks.trim()) {
            alert('Rejection remarks are required');
            return;
        }

        try {
            await mentorAPI.rejectAnnouncement(selectedAnnouncement.id, rejectionRemarks);
            setShowRejectModal(false);
            setRejectionRemarks('');
            loadData();
        } catch (error) {
            console.error('Failed to reject:', error);
        }
    };

    const handleBlockStudent = async (studentId: string) => {
        if (!confirm('Are you sure you want to block this student?')) return;
        try {
            await mentorAPI.blockStudent(studentId);
            loadData();
        } catch (error) {
            console.error('Failed to block student:', error);
        }
    };

    const handleUnblockStudent = async (studentId: string) => {
        try {
            await mentorAPI.unblockStudent(studentId);
            loadData();
        } catch (error) {
            console.error('Failed to unblock student:', error);
        }
    };

    const handleBroadcast = async (title: string, content: string) => {
        if (broadcastTarget === 'students') {
            await mentorAPI.broadcastToStudents(title, content);
        } else {
            await mentorAPI.broadcastToMentors(title, content);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={() => {
                            setBroadcastTarget('students');
                            setShowBroadcastModal(true);
                        }}
                        className="btn btn-primary"
                    >
                        Broadcast to Students
                    </button>
                    <button
                        onClick={() => {
                            setBroadcastTarget('mentors');
                            setShowBroadcastModal(true);
                        }}
                        className="btn btn-secondary"
                    >
                        Broadcast to Mentors
                    </button>
                </div>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['pending', 'students'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab === 'pending' ? 'Pending Announcements' : 'My Students'}
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
                    {activeTab === 'pending' && (
                        <div className="space-y-4">
                            {pendingAnnouncements.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No pending announcements</p>
                            ) : (
                                pendingAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="card">
                                        <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">
                                                By {announcement.author.name} ({announcement.author.email})
                                            </p>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleApproveClick(announcement)}
                                                    className="btn btn-primary"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedAnnouncement(announcement);
                                                        setShowRejectModal(true);
                                                    }}
                                                    className="btn btn-danger"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No students assigned
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.firstName} {student.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.college}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.city}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.batchYear}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${student.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                        student.status?.toUpperCase() === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {student.status?.toUpperCase() === 'BLOCKED' ? (
                                                        <button
                                                            onClick={() => handleUnblockStudent(student.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Unblock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleBlockStudent(student.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Block
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Announcement">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Provide feedback for <strong>{selectedAnnouncement?.title}</strong>
                    </p>
                    <div>
                        <label className="label">Rejection Remarks (Required)</label>
                        <textarea
                            className="input min-h-[100px]"
                            placeholder="Explain why this announcement is being rejected..."
                            value={rejectionRemarks}
                            onChange={(e) => setRejectionRemarks(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleReject}
                            disabled={!rejectionRemarks.trim()}
                            className="btn btn-danger flex-1"
                        >
                            Reject
                        </button>
                        <button onClick={() => {
                            setShowRejectModal(false);
                            setRejectionRemarks('');
                        }} className="btn btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve Announcement">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Approve <strong>{selectedAnnouncement?.title}</strong> and select target batches (optional):
                    </p>

                    {availableBatches.length > 0 && (
                        <div>
                            <label className="label">Target Batches (Leave empty for all students)</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {availableBatches.map((batch) => (
                                    <label key={batch} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedBatches.includes(batch)}
                                            onChange={() => toggleBatch(batch)}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Batch {batch}</span>
                                    </label>
                                ))}
                            </div>
                            {selectedBatches.length > 0 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Selected: {selectedBatches.sort((a, b) => b - a).join(', ')}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded text-xs">
                        {selectedBatches.length > 0
                            ? `This announcement will be visible only to students in batch ${selectedBatches.sort((a, b) => b - a).join(', ')}`
                            : 'This announcement will be visible to all students'}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleApprove}
                            className="btn btn-primary flex-1"
                        >
                            Approve
                        </button>
                        <button onClick={() => {
                            setShowApproveModal(false);
                            setSelectedBatches([]);
                        }} className="btn btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <BroadcastModal
                isOpen={showBroadcastModal}
                onClose={() => setShowBroadcastModal(false)}
                onSend={async (title, content) => {
                    await handleBroadcast(title, content);
                }}
                title={`Broadcast to ${broadcastTarget === 'students' ? 'Assigned Students' : 'All Mentors'}`}
            />
        </div>
    );
}
