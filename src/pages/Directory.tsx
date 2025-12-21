// src/pages/Directory.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  MapPin,
  Building2,
  Search,
  Trash2,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Github,
} from "lucide-react";
import { studentAPI } from "../api/student";
import { DirectoryGridSkeleton } from "../components/DashboardSkeleton";

export default function Directory() {
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [filters, setFilters] = useState({
    search: "",
    college: "",
    city: "",
    batch: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  // mobile filter panel
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  const loadFilterOptions = async () => {
    try {
      const [collegeData, cityData, batchData] = await Promise.all([
        studentAPI.getColleges(),
        studentAPI.getCities(),
        // ensure your API has this endpoint; if not, you can derive batches from students or provide static options
        studentAPI.getBatches?.() ?? Promise.resolve([]),
      ]);
      setColleges(collegeData || []);
      setCities(cityData || []);
      setBatches(batchData || []);
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.searchDirectory({
        ...filters,
        page,
        pageSize,
      });
      if (Array.isArray(res)) {
        setStudents(res);
        setTotal(res.length);
      } else {
        setStudents(res.items || []);
        setTotal(res.total ?? (res.items?.length ?? 0));
      }
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setPage(1); // reset page on filter change
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", college: "", city: "", batch: "" });
    setPage(1);
    setMobileOpen(false);
  };

  const startIdx = total === 0 ? 0 : (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + students.length, total || students.length);

  const totalPages = Math.max(1, Math.ceil((total || students.length) / pageSize));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Filter className="text-indigo-600" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Student Directory</h1>
              <p className="text-sm text-slate-600">Find and connect with students across colleges.</p>
            </div>
          </div>
        </div>

        {/* Filters container */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Mobile header + toggle */}
          <div className="md:hidden flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Students</h3>
              <p className="text-xs text-slate-500">Use filters to narrow results</p>
            </div>

            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-filters"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
            >
              Filters
              <svg
                className={`w-3 h-3 transform transition-transform ${mobileOpen ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Mobile stacked filters */}
          {mobileOpen && (
            <div id="mobile-filters" className="md:hidden mb-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Name or email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">College</label>
                <select
                  value={filters.college}
                  onChange={(e) => handleFilterChange("college", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Batch</label>
                <select
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Batches</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    clearFilters();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Desktop / tablet grid filters */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">College</label>
              <select
                value={filters.college}
                onChange={(e) => handleFilterChange("college", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Batch</label>
              <select
                value={filters.batch}
                onChange={(e) => handleFilterChange("batch", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Batches</option>
                {batches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <div className="flex items-end xl:items-center">
              <button
                onClick={clearFilters}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* footer line with count & per-page + pagination controls at right */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-slate-600">
              {total === 0 ? (
                <>Showing 0 students</>
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-900">{startIdx + 1}</span>–{" "}
                  <span className="font-semibold text-slate-900">{endIdx}</span> of{" "}
                  <span className="font-semibold text-slate-900">{total}</span> students
                </>
              )}
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
              <label className="text-xs text-slate-600 hidden md:inline">Per page</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-white text-sm"
              >
                {[6, 12, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              {/* Pagination controls moved to bottom-right */}
              <div className="ml-2 flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-white text-sm ${page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:shadow"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-sm text-slate-600 px-2">Page {page}/{totalPages}</span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-white text-sm ${page >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:shadow"}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <DirectoryGridSkeleton />
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
            <div className="mx-auto max-w-md">
              <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Users className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No students found</h3>
              <p className="text-sm text-slate-600 mt-2">Try changing filters or search terms.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">

            {students.map((student) => (
              <Link key={student.id} to="" className="group relative">
  <article
  className="
    relative h-full flex flex-col
    rounded-2xl bg-white
    border border-gray-200
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-lg
  "
>
  {/* Header strip */}
  <div className="h-20 bg-indigo-500 rounded-t-2xl" />

  {/* Avatar */}
  <div className="relative -mt-10 px-5">
    <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center">
        {getInitials(student)}
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="px-5 pt-3 pb-4 flex-1">
    <h3 className="text-base font-semibold text-gray-900">
      {student.firstName} {student.lastName}
    </h3>

    <p className="text-sm text-gray-500 mb-3">
      {student.college || "—"}
    </p>

    <div className="space-y-2 text-sm text-gray-600">
      <InfoRow Icon={MapPin} label="City" value={student.city} />
      <InfoRow Icon={GraduationCap} label="Batch" value={student.batchYear} />
    </div>
  </div>

  {/* Connect section (like 2nd card) */}
  {(student.linkedInUrl || student.githubUrl) && (
    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
      <p className="text-xs font-medium text-gray-500 mb-2 uppercase">
        Connect
      </p>

      <div className="flex gap-2">
        {student.linkedInUrl && (
          <a
            href={student.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5
              rounded-full
              text-xs font-medium
              bg-blue-100 text-blue-700
              border border-blue-200
              hover:bg-blue-600 hover:text-white
              transition
            "
          >
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
        )}

        {student.githubUrl && (
          <a
            href={student.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5
              rounded-full
              text-xs font-medium
              bg-gray-200 text-gray-800
              border border-gray-300
              hover:bg-gray-900 hover:text-white
              transition
            "
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        )}
      </div>
    </div>
  )}
</article>









</Link>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ helpers ------------------ */

function InfoRow({
  Icon,
  label,
  value,
  highlight = false,
}: {
  Icon: any;
  label: string;
  value?: string | number;
  highlight?: boolean;
}) {
  return (
    <p className="flex items-center gap-2">
      <Icon size={16} className={highlight ? "text-indigo-600" : "text-gray-400"} />
      <span className="font-medium text-gray-800">{label}:</span>
      <span className="truncate text-gray-600">{value || "—"}</span>
    </p>
  );
}

function getInitials(student: any) {
  const a = (student?.firstName || "").trim().charAt(0) || "";
  const b = (student?.lastName || "").trim().charAt(0) || "";
  return (a + b).toUpperCase() || "?";
}
