import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../api/student';

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
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Found {students.length} student{students.length !== 1 ? 's' : ''}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.length === 0 ? (
                            <p className="col-span-full text-gray-500 text-center py-8">
                                No students found matching your filters
                            </p>
                        ) : (
                            students.map((student) => (
                                <div key={student.id} className="card">
                                    <h3 className="font-semibold text-lg mb-2">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <strong>College:</strong> {student.college}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <strong>City:</strong> {student.city}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        <strong>Batch:</strong> {student.batchYear}
                                    </p>

                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
