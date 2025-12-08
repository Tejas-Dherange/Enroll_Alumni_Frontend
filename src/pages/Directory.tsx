import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Building2 } from 'lucide-react';
import { studentAPI } from '../api/student';
import { DirectoryGridSkeleton } from '../components/DashboardSkeleton';

export default function Directory() {
    const [students, setStudents] = useState<any[]>([]);
    const [colleges, setColleges] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        college: '',
        city: '',
        search: ''
    });

    useEffect(() => {
        loadFilterOptions();
    }, []);

    useEffect(() => {
        loadStudents();
    }, [filters]);

    const loadFilterOptions = async () => {
        try {
            const [collegeData, cityData] = await Promise.all([
                studentAPI.getColleges(),
                studentAPI.getCities()
            ]);
            setColleges(collegeData);
            setCities(cityData);
        } catch (error) {
            console.error('Failed to load filter options:', error);
        }
    };

    const loadStudents = async () => {
        setLoading(true);
        try {
            const data = await studentAPI.searchDirectory(filters);
            setStudents(data);
        } catch (error) {
            console.error('Failed to load students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ college: '', city: '', search: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Directory</h1>

            {/* Filters */}
            <div className="card mb-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <label className="label">Search</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Name or email..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="label">College</label>
                        <select
                            className="input"
                            value={filters.college}
                            onChange={(e) => handleFilterChange('college', e.target.value)}
                        >
                            <option value="">All Colleges</option>
                            {colleges.map((college) => (
                                <option key={college} value={college}>
                                    {college}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">City</label>
                        <select
                            className="input"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={clearFilters} className="btn btn-secondary w-full">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <DirectoryGridSkeleton />
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Found {students.length} student{students.length !== 1 ? 's' : ''}
                    </div>

                    {students.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No students found matching your filters</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map((student) => (
                                <Link
                                    key={student.id}
                                    className="group"
                                >
                                    <div
                                        className="
                                            cursor-pointer
                                            rounded-xl border border-gray-200 bg-white
                                            p-5 shadow-sm transition-transform transform
                                            hover:shadow-md hover:-translate-y-1 hover:bg-gray-50
                                            h-full flex flex-col
                                        "
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-xl text-gray-800">
                                                {student.firstName} {student.lastName}
                                            </h3>

                                            <span className="text-sm px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                                {student.batchYear || '—'}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-3 text-gray-600 text-sm">
                                            <p className="flex items-center gap-2">
                                                <Building2 size={16} className="text-gray-500" />
                                                <span className="font-medium text-gray-700">College:</span>
                                                <span className="truncate">{student.college || '—'}</span>
                                            </p>

                                            <p className="flex items-center gap-2">
                                                <MapPin size={16} className="text-gray-500" />
                                                <span className="font-medium text-gray-700">City:</span>
                                                <span>{student.city || '—'}</span>
                                            </p>

                                            <p className="flex items-center gap-2">
                                                <GraduationCap size={16} className="text-indigo-600" />
                                                <span className="font-medium text-gray-700">Batch:</span>
                                                <span>{student.batchYear || '—'}</span>
                                            </p>
                                        </div>

                                        
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
