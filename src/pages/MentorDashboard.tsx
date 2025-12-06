import { useEffect, useState } from 'react';
import { mentorAPI } from '../api/mentor';
import Modal from '../components/Modal';

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [rejectionRemarks, setRejectionRemarks] = useState('');

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
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (announcementId: string) => {
        try {
            await mentorAPI.approveAnnouncement(announcementId);
            loadData();
        } catch (error) {
            console.error('Failed to approve:', error);
        }
    };

    const handleReject = async () => {
        if (!selectedAnnouncement) return;
        try {
            await mentorAPI.rejectAnnouncement(selectedAnnouncement.id, rejectionRemarks);
            setShowRejectModal(false);
            setRejectionRemarks('');
            loadData();
        } catch (error) {
            console.error('Failed to reject:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentor Dashboard</h1>

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
                                                    onClick={() => handleApprove(announcement.id)}
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.length === 0 ? (
                                <p className="text-gray-500 col-span-full text-center py-8">No students assigned</p>
                            ) : (
                                students.map((student) => (
                                    <div key={student.id} className="card">
                                        <h3 className="font-semibold text-lg">
                                            {student.firstName} {student.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{student.email}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {student.college} • {student.city}
                                        </p>
                                        <p className="text-sm text-gray-500">Batch {student.batchYear}</p>
                                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Announcement">
                <div className="space-y-4">
                    <p>Provide feedback for rejection (optional):</p>
                    <textarea
                        className="input min-h-[100px]"
                        placeholder="Enter remarks..."
                        value={rejectionRemarks}
                        onChange={(e) => setRejectionRemarks(e.target.value)}
                    />
                    <div className="flex space-x-3">
                        <button onClick={handleReject} className="btn btn-danger flex-1">
                            Reject
                        </button>
                        <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
