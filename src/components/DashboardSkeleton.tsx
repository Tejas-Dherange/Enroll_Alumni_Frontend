import React from 'react';

/**
 * Skeleton loader for Admin Dashboard statistics tab
 */
export const StatisticsSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card bg-gradient-to-br from-gray-100 to-gray-200 h-40">
                        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                        <div className="h-12 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Skeleton loader for pending students/list views
 */
export const ListSkeleton: React.FC = () => {
    return (
        <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="card flex justify-between items-center">
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
            ))}
        </div>
    );
};

/**
 * Skeleton loader for Student Dashboard
 */
export const StudentDashboardSkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header skeleton */}
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>

            {/* Quick Access Cards */}
            <div className="mb-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="card bg-gradient-to-br from-gray-100 to-gray-200 h-24"></div>
                    ))}
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column - Announcements */}
                <div className="lg:col-span-2 space-y-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="card h-32 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                        ))}
                    </div>
                </div>

                {/* Right column - Mentor & Profile */}
                <div className="space-y-6 animate-pulse">
                    <div className="card h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    <div className="card h-40 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * Skeleton loader for Announcements Feed page
 */
export const AnnouncementsFeedSkeleton: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-8 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
                <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Announcement cards skeleton */}
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="h-7 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="space-y-2 mb-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Skeleton loader for Directory page (grid of student cards)
 */
export const DirectoryGridSkeleton: React.FC = () => {
    return (
        <>
            <div className="mb-4 text-sm text-gray-600 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

/**
 * Skeleton loader for Messages page - Full page variant
 */
export const MessagesPageSkeleton: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card animate-pulse">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>

                {/* Messages area */}
                <div className="h-96 mb-4 space-y-3">
                    <MessagesConversationSkeleton />
                </div>

                {/* Input area */}
                <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * Skeleton loader for Messages conversation (message bubbles)
 */
export const MessagesConversationSkeleton: React.FC = () => {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} animate-pulse`}
                >
                    <div className={`h-16 bg-gray-200 rounded-lg ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'
                        }`}></div>
                </div>
            ))}
        </>
    );
};

/**
 * Skeleton loader for Mentor Dashboard (table view)
 */
export const MentorTableSkeleton: React.FC = () => {
    return (
        <>
            {/* Filter bar skeleton */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i}>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Table skeleton */}
            <div className="overflow-x-auto animate-pulse">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[...Array(6)].map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                {[...Array(6)].map((_, j) => (
                                    <td key={j} className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

/**
 * Shimmer effect loader for inline use
 */
export const ShimmerLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

            <div className="w-full max-w-md space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-3 rounded-full shimmer-bar"
                        style={{
                            width: `${100 - i * 15}%`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {message && (
                <p className="text-gray-500 text-sm font-medium animate-pulse mt-4">
                    {message}
                </p>
            )}
        </div>
    );
};
