import { useState, useMemo } from 'react';

interface MentorsSectionProps {
    mentors: any[];
    onBlockUser: (userId: string) => void;
    onUnblockUser: (userId: string) => void;
    onAddMentor: () => void;
}

export default function MentorsSection({ mentors, onBlockUser, onUnblockUser, onAddMentor }: MentorsSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Filtered mentors
    const filteredMentors = useMemo(() => {
        let filtered = [...mentors];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
                m.email.toLowerCase().includes(query)
            );
        }

        if (filterStatus) {
            filtered = filtered.filter(m => m.status?.toUpperCase() === filterStatus);
        }

        return filtered;
    }, [mentors, searchQuery, filterStatus]);

    const uniqueStatuses = [...new Set(mentors.map(m => m.status).filter(Boolean))];

    return (
        <>
            {/* Search and Filter Controls */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-full">
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                    Showing {filteredMentors.length} of {mentors.length} mentors
                </div>
            </div>

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
                        {filteredMentors.map((mentor) => (
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
                                            onClick={() => onUnblockUser(mentor.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onBlockUser(mentor.id)}
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
