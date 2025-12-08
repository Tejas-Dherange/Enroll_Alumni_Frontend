import { useEffect, useState } from 'react';
import { mentorAPI } from '../api/mentor';
import BroadcastModal from '../components/BroadcastModal';
import ChatWidget from '../components/ChatWidget';
import { MentorTableSkeleton } from '../components/DashboardSkeleton';

export default function MentorDashboard() {
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastTarget, setBroadcastTarget] = useState<'students' | 'mentors'>('students');

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCollege, setFilterCollege] = useState('');
    const [filterCity, setFilterCity] = useState('');

    // Chat widget state
    const [showChatWidget, setShowChatWidget] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await mentorAPI.getAssignedStudents();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters whenever search or filter values change
    useEffect(() => {
        let filtered = [...students];

        // Search filter (name or email)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(student =>
                `${student.firstName} ${student.lastName}`.toLowerCase().includes(query) ||
                student.email.toLowerCase().includes(query)
            );
        }

        // Batch filter
        if (filterBatch) {
            filtered = filtered.filter(student => student.batchYear?.toString() === filterBatch);
        }

        // Status filter
        if (filterStatus) {
            filtered = filtered.filter(student => student.status?.toUpperCase() === filterStatus);
        }

        // College filter
        if (filterCollege) {
            filtered = filtered.filter(student => student.college === filterCollege);
        }

        // City filter
        if (filterCity) {
            filtered = filtered.filter(student => student.city === filterCity);
        }

        setFilteredStudents(filtered);
    }, [students, searchQuery, filterBatch, filterStatus, filterCollege, filterCity]);

    // Get unique values for filter dropdowns
    const uniqueBatches = [...new Set(students.map(s => s.batchYear).filter(Boolean))].sort((a, b) => b - a);
    const uniqueStatuses = [...new Set(students.map(s => s.status).filter(Boolean))];
    const uniqueColleges = [...new Set(students.map(s => s.college).filter(Boolean))].sort();
    const uniqueCities = [...new Set(students.map(s => s.city).filter(Boolean))].sort();

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

            {loading ? (
                <MentorTableSkeleton />
            ) : (
                <>
                    {/* Search and Filter Controls */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input w-full"
                                />
                            </div>

                            {/* Batch Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
                                <select
                                    value={filterBatch}
                                    onChange={(e) => setFilterBatch(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="">All Batches</option>
                                    {uniqueBatches.map(batch => (
                                        <option key={batch} value={batch}>{batch}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="">All Statuses</option>
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* College Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                                <select
                                    value={filterCollege}
                                    onChange={(e) => setFilterCollege(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="">All Colleges</option>
                                    {uniqueColleges.map(college => (
                                        <option key={college} value={college}>{college}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="">All Cities</option>
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredStudents.length} of {students.length} students
                        </div>
                    </div>

                    {/* Students Table */}
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {students.length === 0 ? 'No students assigned' : 'No students match your filters'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setShowChatWidget(true);
                                            }}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
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
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Broadcast Modal */}
            <BroadcastModal
                isOpen={showBroadcastModal}
                onClose={() => setShowBroadcastModal(false)}
                onSend={async (title, content) => {
                    await handleBroadcast(title, content);
                }}
                title={`Broadcast to ${broadcastTarget === 'students' ? 'Assigned Students' : 'All Mentors'}`}
            />

            {/* Chat Widget */}
            {selectedStudent && (
                <ChatWidget
                    isOpen={showChatWidget}
                    onClose={() => {
                        setShowChatWidget(false);
                        setSelectedStudent(null);
                    }}
                    studentId={selectedStudent.id}
                    studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                />
            )}
        </div>
    );
}