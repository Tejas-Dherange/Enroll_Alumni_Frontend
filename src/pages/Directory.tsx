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
} from "lucide-react";
import { studentAPI } from "../api/student";
import { DirectoryGridSkeleton } from "../components/DashboardSkeleton";

export default function Directory() {
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [filters, setFilters] = useState({
    search: "",
    college: "",
    city: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  const loadFilterOptions = async () => {
    try {
      const [collegeData, cityData] = await Promise.all([
        studentAPI.getColleges(),
        studentAPI.getCities(),
      ]);
      setColleges(collegeData || []);
      setCities(cityData || []);
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
    setFilters({ search: "", college: "", city: "" });
    setPage(1);
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

        {/* Filters */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Clear */}
            <div className="flex items-end">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Link key={student.id} to={""} className="group">
                <article className="bg-gradient-to-br from-white via-white to-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transform transition hover:-translate-y-1 h-full flex flex-col">
                  {/* Card header with initials */}
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold"
                         style={{ background: `linear-gradient(135deg,#6366f1, #7c3aed)` }}>
                      {getInitials(student)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 truncate">{student.email || "—"}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium">
                        {student.batchYear || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 pt-0">
                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
                      <InfoRow Icon={Building2} label="College" value={student.college} />
                      <InfoRow Icon={MapPin} label="City" value={student.city} />
                      <InfoRow Icon={GraduationCap} label="Batch" value={student.batchYear || "—"} />
                    </div>
                  </div>

                  {/* <div className="p-4 border-t border-gray-100 bg-white/80 flex items-center justify-between">
                    <div className="text-xs text-slate-500">Member</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">
                        <svg width="8" height="8" viewBox="0 0 8 8" className="mr-1">
                          <circle cx="4" cy="4" r="4" fill="#4f46e5" />
                        </svg>
                        Active
                      </span>
                      <Link to={`/directory/${student.id}`} className="text-indigo-600 text-sm font-medium hover:underline">
                        View
                      </Link>
                    </div>
                  </div> */}
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
