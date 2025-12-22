// src/pages/MentorDashboard.tsx
import { useEffect, useState } from 'react';
import { mentorAPI } from '../api/mentor';
import { announcementAPI } from '../api/announcements';
import BroadcastModal from '../components/BroadcastModal';
import ChatWidget from '../components/ChatWidget';
import { MentorTableSkeleton } from '../components/DashboardSkeleton';

export default function MentorDashboard() {
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastTarget, setBroadcastTarget] = useState<'students' | 'mentors'>('students');
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    // Search + Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCollege, setFilterCollege] = useState('');
    const [filterCity, setFilterCity] = useState('');

    // Mobile UI
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Chat widget
    const [showChatWidget, setShowChatWidget] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (forceRefresh = false) => {
        if (!forceRefresh && dataLoaded) return;

        setLoading(true);
        try {
            const data = await mentorAPI.getAssignedStudents();
            setStudents(data);
            setFilteredStudents(data);
            setDataLoaded(true);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...students];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q)
            );
        }

        if (filterBatch) filtered = filtered.filter(s => s.batchYear?.toString() === filterBatch);
        if (filterStatus) filtered = filtered.filter(s => s.status?.toUpperCase() === filterStatus);
        if (filterCollege) filtered = filtered.filter(s => s.college === filterCollege);
        if (filterCity) filtered = filtered.filter(s => s.city === filterCity);

        setFilteredStudents(filtered);
    }, [students, searchQuery, filterBatch, filterStatus, filterCollege, filterCity]);

    // Unique values for filters
    const uniqueBatches = [...new Set(students.map(s => s.batchYear).filter(Boolean))].sort((a, b) => b - a);
    const uniqueStatuses = [...new Set(students.map(s => s.status).filter(Boolean))];
    const uniqueColleges = [...new Set(students.map(s => s.college).filter(Boolean))].sort();
    const uniqueCities = [...new Set(students.map(s => s.city).filter(Boolean))].sort();

    const handleBroadcast = async (title: string, content: string) => {
        if (broadcastTarget === 'students') await mentorAPI.broadcastToStudents(title, content);
        else await mentorAPI.broadcastToMentors(title, content);
    };

    const handleCreateAnnouncement = async (title: string, content: string) => {
        try {
            await announcementAPI.createMentorAnnouncement(title, content);
            alert('Announcement created successfully! It will be visible after admin approval.');
            setShowAnnouncementModal(false);
        } catch (error) {
            console.error('Failed to create announcement:', error);
            alert('Failed to create announcement. Please try again.');
        }
    };

    const handleBlockStudent = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await mentorAPI.blockStudent(id);
        setDataLoaded(false);
        loadData(true);
    };

    const handleUnblockStudent = async (id: string) => {
        await mentorAPI.unblockStudent(id);
        setDataLoaded(false);
        loadData(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            {/* Responsive header: title on left; buttons on right on md+, stacked on small screens */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>

                {/* Buttons container:
                    - on small screens it becomes full-width and buttons stack
                    - on sm+ it shows inline and sizes naturally
                */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => setShowAnnouncementModal(true)}
                        className="w-full sm:w-auto flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 
                        text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 
                        transition-all duration-200 whitespace-nowrap"
                        aria-label="Create announcement"
                    >
                        📢 Create Announcement
                    </button>

                    <button
                        onClick={() => {
                            setBroadcastTarget('students');
                            setShowBroadcastModal(true);
                        }}
                        className="w-full sm:w-auto flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                        text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 
                        transition-all duration-200 whitespace-nowrap"
                        aria-label="Broadcast to students"
                    >
                        Broadcast to Students
                    </button>

                    <button
                        onClick={() => {
                            setBroadcastTarget('mentors');
                            setShowBroadcastModal(true);
                        }}
                        className="w-full sm:w-auto flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-indigo-300 bg-white 
                        text-indigo-700 font-semibold hover:bg-indigo-50 hover:border-indigo-400 
                        transition-all duration-200 shadow-sm whitespace-nowrap"
                        aria-label="Broadcast to mentors"
                    >
                        Broadcast to Mentors
                    </button>
                </div>
            </div>

            {/* ---------------- MOBILE FILTER UI ---------------- */}
            <div className="md:hidden mb-5">

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name or email..."
                        className="input w-full"
                    />

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full mt-3 py-2 rounded-lg border bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                        {showMobileFilters ? "Hide Filters ▲" : "Show Filters ▼"}
                    </button>
                </div>

                {/* Sliding Filters Panel */}
                <div className={`transition-all duration-300 overflow-hidden ${showMobileFilters ? "max-h-[900px] mt-3" : "max-h-0"}`}>
                    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-4">

                        {/* Batch */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Batch Year</label>
                            <select className="input w-full" value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}>
                                <option value="">All Batches</option>
                                {uniqueBatches.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>

                        {/* Status Chips */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {["", ...uniqueStatuses].map((s) => {
                                    const label = s === "" ? "All" : s;
                                    const active = filterStatus === s;
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setFilterStatus(s)}
                                            className={`px-3 py-1.5 rounded-full text-sm border transition ${active
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* College */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">College</label>
                            <select className="input w-full" value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)}>
                                <option value="">All Colleges</option>
                                {uniqueColleges.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <select className="input w-full" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                                <option value="">All Cities</option>
                                {uniqueCities.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Reset button */}
                        <button
                            className="w-full py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition"
                            onClick={() => {
                                setSearchQuery('');
                                setFilterBatch('');
                                setFilterStatus('');
                                setFilterCollege('');
                                setFilterCity('');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------- DESKTOP FILTERS (UNCHANGED) ---------------- */}
            <div className="hidden md:block mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input className="input w-full" value={searchQuery} placeholder="Name or email..."
                            onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <select className="input w-full" value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}>
                            <option value="">All Batches</option>
                            {uniqueBatches.map(b => <option key={b}>{b}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="input w-full" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                        <select className="input w-full" value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)}>
                            <option value="">All Colleges</option>
                            {uniqueColleges.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <select className="input w-full" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                            <option value="">All Cities</option>
                            {uniqueCities.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                    Showing {filteredStudents.length} of {students.length} students
                </div>
            </div>


            {/* ---------------- Student List ---------------- */}
            {loading ? (
                <MentorTableSkeleton />
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
                                            {students.length ? "No students match your filters" : "No students assigned"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((s) => (
                                        <tr key={s.id}
                                            onClick={() => { setSelectedStudent(s); setShowChatWidget(true); }}
                                            className="cursor-pointer hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{s.firstName} {s.lastName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{s.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{s.college}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{s.city}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{s.batchYear}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${s.status?.toUpperCase() === "ACTIVE"
                                                    ? "bg-green-100 text-green-800"
                                                    : s.status?.toUpperCase() === "BLOCKED"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-4 mt-4">
                        {filteredStudents.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => { setSelectedStudent(s); setShowChatWidget(true); }}
                                className="bg-white border p-4 rounded-xl shadow-sm active:scale-[0.98] transition cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                                            {s.firstName[0]}{s.lastName[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{s.firstName} {s.lastName}</h3>
                                            <p className="text-sm text-gray-500">{s.email}</p>
                                        </div>
                                    </div>

                                    <span className={`px-2 py-1 text-xs rounded-full ${s.status?.toUpperCase() === "ACTIVE"
                                        ? "bg-green-100 text-green-800"
                                        : s.status?.toUpperCase() === "BLOCKED"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {s.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t pt-3">
                                    <div><span className="text-xs text-gray-400 block">College</span>{s.college}</div>
                                    <div><span className="text-xs text-gray-400 block">City</span>{s.city}</div>
                                    <div><span className="text-xs text-gray-400 block">Batch</span>{s.batchYear}</div>
                                </div>

                                <div className="mt-3 text-center text-indigo-600 text-sm font-medium">Tap to chat</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modals */}
            <BroadcastModal
                isOpen={showAnnouncementModal}
                onClose={() => setShowAnnouncementModal(false)}
                onSend={handleCreateAnnouncement}
                title="Create Public Announcement"
            />

            <BroadcastModal
                isOpen={showBroadcastModal}
                onClose={() => setShowBroadcastModal(false)}
                onSend={handleBroadcast}
                title={`Broadcast to ${broadcastTarget === 'students' ? 'Assigned Students' : 'All Mentors'}`}
            />

            {selectedStudent && (
                <ChatWidget
                    isOpen={showChatWidget}
                    onClose={() => { setShowChatWidget(false); setSelectedStudent(null); }}
                    studentId={selectedStudent.id}
                    studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                />
            )}
        </div>
    );
}
