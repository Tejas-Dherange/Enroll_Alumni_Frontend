import { useState, useMemo } from 'react';

interface StudentsSectionProps {
    students: any[];
    mentors: any[];
    onBlockUser: (userId: string) => void;
    onUnblockUser: (userId: string) => void;
}

export default function StudentsSection({ students, mentors, onBlockUser, onUnblockUser }: StudentsSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMentor, setFilterMentor] = useState('');

    // Filtered students
    const filteredStudents = useMemo(() => {
        let filtered = [...students];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query)
            );
        }

        if (filterBatch) {
            filtered = filtered.filter(s => s.batchYear?.toString() === filterBatch);
        }

        if (filterStatus) {
            filtered = filtered.filter(s => s.status?.toUpperCase() === filterStatus);
        }

        if (filterMentor) {
            filtered = filtered.filter(s => s.mentor?.id === filterMentor);
        }

        return filtered;
    }, [students, searchQuery, filterBatch, filterStatus, filterMentor]);

    const uniqueBatches = [...new Set(students.map(s => s.batchYear).filter(Boolean))].sort((a, b) => b - a);
    const uniqueStatuses = [...new Set(students.map(s => s.status).filter(Boolean))];

    return (
        <>
            {/* Search and Filter Controls */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
                        <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="input w-full">
                            <option value="">All Batches</option>
                            {uniqueBatches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-full">
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mentor</label>
                        <select value={filterMentor} onChange={(e) => setFilterMentor(e.target.value)} className="input w-full">
                            <option value="">All Mentors</option>
                            {mentors.filter(m => m.status === 'ACTIVE').map(mentor => (
                                <option key={mentor.id} value={mentor.id}>{mentor.firstName} {mentor.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                    Showing {filteredStudents.length} of {students.length} students
                </div>
            </div>

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
                        {filteredStudents.map((student) => (
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
                                            onClick={() => onUnblockUser(student.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onBlockUser(student.id)}
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
        </>
    );
}
