import { useState, useMemo, useEffect } from 'react';

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // show tens by default

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

    // Reset to page 1 when the filtered list or page size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredStudents, pageSize]);

    // Pagination calculations
    const totalItems = filteredStudents.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalItems);

    const paginatedStudents = useMemo(() => {
        return filteredStudents.slice(startIdx, endIdx);
    }, [filteredStudents, startIdx, endIdx]);

    const uniqueBatches = [...new Set(students.map(s => s.batchYear).filter(Boolean))].sort((a, b) => b - a);
    const uniqueStatuses = [...new Set(students.map(s => s.status).filter(Boolean))];

    const gotoPage = (page: number) => {
        const p = Math.max(1, Math.min(totalPages, page));
        setCurrentPage(p);
        // scroll into view for better UX (optional)
        // document.querySelector('#students-table')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Helper to render page numbers with simple truncation for many pages
    const renderPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: number[] = [];
        pages.push(1);

        const left = Math.max(2, currentPage - 1);
        const right = Math.min(totalPages - 1, currentPage + 1);

        if (left > 2) pages.push(-1); // -1 represents "..."
        for (let p = left; p <= right; p++) pages.push(p);
        if (right < totalPages - 1) pages.push(-1);
        pages.push(totalPages);

        return pages;
    };

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

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        {/* Showing range */}
                        {totalItems === 0 ? (
                            <>Showing 0 students</>
                        ) : (
                            <>Showing {startIdx + 1}–{endIdx} of {totalItems} students</>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Per page:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="input"
                        >
                            {[5, 10, 20, 50].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto" id="students-table">
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
                        {paginatedStudents.map((student) => (
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

                        {/* If no students on this page show an empty row */}
                        {paginatedStudents.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No students to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </div>

                <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                        onClick={() => gotoPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                        {renderPageNumbers().map((p, i) => (
                            p === -1 ? (
                                <span key={`dots-${i}`} className="px-2">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => gotoPage(p)}
                                    className={`px-3 py-1 rounded border ${p === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}
                                >
                                    {p}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => gotoPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </>
    );
}
