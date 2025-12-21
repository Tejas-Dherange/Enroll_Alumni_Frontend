import { useState, useMemo, useEffect } from 'react';

interface MentorsSectionProps {
    mentors: any[];
    onBlockUser: (userId: string) => void;
    onUnblockUser: (userId: string) => void;
}

export default function MentorsSection({ mentors, onBlockUser, onUnblockUser }: MentorsSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    // Reset to page 1 when the filtered list or page size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredMentors, pageSize]);

    // Pagination calculations
    const totalItems = filteredMentors.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalItems);

    const paginatedMentors = useMemo(() => {
        return filteredMentors.slice(startIdx, endIdx);
    }, [filteredMentors, startIdx, endIdx]);

    const uniqueStatuses = [...new Set(mentors.map(m => m.status).filter(Boolean))];

    const gotoPage = (page: number) => {
        const p = Math.max(1, Math.min(totalPages, page));
        setCurrentPage(p);
    };

    const handleBlockUser = async (userId: string) => {
        setLoadingUserId(userId);
        try {
            await onBlockUser(userId);
        } finally {
            setLoadingUserId(null);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        setLoadingUserId(userId);
        try {
            await onUnblockUser(userId);
        } finally {
            setLoadingUserId(null);
        }
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
            <div className="mb-6 bg-white p-5 rounded-xl shadow-md border border-gray-100">

                {/* Mobile Filter Toggle */}
                <div className="md:hidden flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-indigo-600"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
                            <p className="text-xs text-slate-500">Narrow down list</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition text-sm font-medium"
                    >
                        Filters
                        <svg
                            className={`w-4 h-4 transform transition-transform ${showMobileFilters ? 'rotate-180' : 'rotate-0'}`}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Filters Row */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                {uniqueStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Per Page Selector */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Per Page</label>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="w-full border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {[5, 10, 20, 50].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        {/* Showing range */}
                        {totalItems === 0 ? (
                            <>Showing 0 mentors</>
                        ) : (
                            <>Showing {startIdx + 1}–{endIdx} of {totalItems} mentors</>
                        )}
                    </div>
                </div>
            </div>

            {/* --- DESKTOP: Table View --- */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" id="mentors-table">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedMentors.map((mentor) => (
                            <tr
                                key={mentor.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {mentor.firstName} {mentor.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{mentor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${mentor.status?.toUpperCase() === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' :
                                        mentor.status?.toUpperCase() === 'BLOCKED'
                                            ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20' :
                                            'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
                                        }`}>
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${mentor.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-600' :
                                            mentor.status?.toUpperCase() === 'BLOCKED' ? 'bg-red-600' :
                                                'bg-yellow-600'
                                            }`}></span>
                                        {mentor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {mentor.status?.toUpperCase() === 'BLOCKED' ? (
                                        <button
                                            onClick={() => handleUnblockUser(mentor.id)}
                                            disabled={loadingUserId === mentor.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-green-200"
                                        >
                                            {loadingUserId === mentor.id ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Unblocking...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                    </svg>
                                                    Unblock
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBlockUser(mentor.id)}
                                            disabled={loadingUserId === mentor.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
                                        >
                                            {loadingUserId === mentor.id ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Blocking...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                    Block
                                                </>
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {/* If no mentors on this page show an empty row */}
                        {paginatedMentors.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-900 mb-1">No mentors found</p>
                                        <p className="text-sm text-gray-500">Try adjusting your filters or search criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE: Card View --- */}
            <div className="lg:hidden space-y-4">
                {paginatedMentors.map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-semibold">{mentor.firstName?.[0]}{mentor.lastName?.[0]}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{mentor.firstName} {mentor.lastName}</h3>
                                    <p className="text-sm text-gray-500 break-all">{mentor.email}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${mentor.status?.toUpperCase() === 'ACTIVE'
                                ? 'bg-green-100 text-green-800' :
                                mentor.status?.toUpperCase() === 'BLOCKED'
                                    ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {mentor.status}
                            </span>
                        </div>

                        {/* Footer: Actions */}
                        <div className="flex justify-end pt-3 border-t border-gray-50">
                            {mentor.status?.toUpperCase() === 'BLOCKED' ? (
                                <button
                                    onClick={() => handleUnblockUser(mentor.id)}
                                    disabled={loadingUserId === mentor.id}
                                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-colors border border-green-200"
                                >
                                    {loadingUserId === mentor.id ? 'Unblocking...' : 'Unblock User'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBlockUser(mentor.id)}
                                    disabled={loadingUserId === mentor.id}
                                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors border border-red-200"
                                >
                                    {loadingUserId === mentor.id ? 'Blocking...' : 'Block User'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {paginatedMentors.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <p className="text-gray-500">No mentors found.</p>
                    </div>
                )}
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
