import { useState, useEffect } from 'react';
import { X, Linkedin, Github, User, Phone, Building2, MapPin, GraduationCap, FileText } from 'lucide-react';
import { profileAPI } from '../api/profile';
import { useAuthStore } from '../stores/authStore';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, onSuccess }: EditProfileModalProps) {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        linkedInUrl: '',
        githubUrl: '',
        bio: '',
        // Student-specific fields
        college: '',
        city: '',
        batchYear: '',
    });


    useEffect(() => {
        const loadProfileData = async () => {
            if (isOpen && user) {
                try {
                    // Fetch fresh profile data
                    const profileData = await profileAPI.getProfile();
                    console.log('EditProfileModal - Fresh profile data:', profileData);

                    setFormData({
                        firstName: profileData.firstName || user.firstName || '',
                        lastName: profileData.lastName || user.lastName || '',
                        mobileNumber: profileData.mobileNumber || user.mobileNumber || '',
                        linkedInUrl: profileData.linkedInUrl || user.linkedInUrl || '',
                        githubUrl: profileData.githubUrl || user.githubUrl || '',
                        bio: profileData.bio || user.bio || '',
                        college: profileData.studentProfile?.college || user.profile?.college || '',
                        city: profileData.studentProfile?.city || user.profile?.city || '',
                        batchYear: profileData.studentProfile?.batchYear?.toString() || user.profile?.batchYear?.toString() || '',
                    });
                } catch (err) {
                    console.error('Failed to load profile data:', err);
                    // Fallback to user data from store
                    setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        mobileNumber: user.mobileNumber || '',
                        linkedInUrl: user.linkedInUrl || '',
                        githubUrl: user.githubUrl || '',
                        bio: user.bio || '',
                        college: user.profile?.college || '',
                        city: user.profile?.city || '',
                        batchYear: user.profile?.batchYear?.toString() || '',
                    });
                }
                setError('');
                setSuccess('');
            }
        };

        loadProfileData();
    }, [isOpen, user]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const updateData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobileNumber: formData.mobileNumber || null,
                linkedInUrl: formData.linkedInUrl || null,
                githubUrl: formData.githubUrl || null,
                bio: formData.bio || null,
            };

            // Add student-specific fields if user is a student
            if (user?.role === 'STUDENT') {
                updateData.college = formData.college;
                updateData.city = formData.city;
                updateData.batchYear = formData.batchYear ? parseInt(formData.batchYear) : null;
            }

            const response = await profileAPI.updateProfile(updateData);

            // Update user in auth store
            if (response.profile) {
                setUser({
                    ...user!,
                    firstName: response.profile.firstName,
                    lastName: response.profile.lastName,
                    mobileNumber: response.profile.mobileNumber,
                    linkedInUrl: response.profile.linkedInUrl,
                    githubUrl: response.profile.githubUrl,
                    bio: response.profile.bio,
                    profile: response.profile.studentProfile,
                });
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={formData.mobileNumber}
                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-600" />
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={formData.linkedInUrl}
                                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Github className="w-4 h-4 text-gray-800" />
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="https://github.com/yourusername"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            About
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={4}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>

                    {/* Student-specific fields */}
                    {user?.role === 'STUDENT' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    College <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required={user?.role === 'STUDENT'}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required={user?.role === 'STUDENT'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-gray-500" />
                                        Batch Year <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.batchYear}
                                        onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        min="1900"
                                        max="2100"
                                        required={user?.role === 'STUDENT'}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
