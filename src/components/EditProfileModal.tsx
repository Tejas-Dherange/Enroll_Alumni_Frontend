import { useState, useEffect } from 'react';
import {
  X,
  Linkedin,
  Github,
  User,
  Phone,
  Building2,
  MapPin,
  GraduationCap,
  FileText
} from 'lucide-react';
import { profileAPI } from '../api/profile';
import { useAuthStore } from '../stores/authStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSuccess
}: EditProfileModalProps) {
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
    college: '',
    city: '',
    batchYear: '',
  });

  useEffect(() => {
    if (!isOpen || !user) return;

    const loadProfileData = async () => {
      try {
        const profileData = await profileAPI.getProfile();

        setFormData({
          firstName: profileData.firstName || user.firstName || '',
          lastName: profileData.lastName || user.lastName || '',
          mobileNumber: profileData.mobileNumber || '',
          linkedInUrl: profileData.linkedInUrl || '',
          githubUrl: profileData.githubUrl || '',
          bio: profileData.bio || '',
          college: profileData.studentProfile?.college || '',
          city: profileData.studentProfile?.city || '',
          batchYear: profileData.studentProfile?.batchYear?.toString() || '',
        });
      } catch {
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

      if (user?.role === 'STUDENT') {
        updateData.college = formData.college;
        updateData.city = formData.city;
        updateData.batchYear = formData.batchYear
          ? parseInt(formData.batchYear)
          : null;
      }

      const response = await profileAPI.updateProfile(updateData);

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
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Basic Info */}
            <section className="rounded-xl border p-5 bg-gray-50 space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <User className="w-5 h-5  text-blue-600" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" required value={formData.firstName}
                  onChange={(v) => setFormData({ ...formData, firstName: v })} />
                <Input label="Last Name" required value={formData.lastName}
                  onChange={(v) => setFormData({ ...formData, lastName: v })} />
              </div>

              <Input
                label="Mobile Number"
                icon={<Phone className="w-4 h-4  text-blue-600" />}
                value={formData.mobileNumber}
                onChange={(v) => setFormData({ ...formData, mobileNumber: v })}
              />
            </section>

            {/* Social Links */}
            <section className="rounded-xl border p-5 bg-gray-50 space-y-4">
              <h3 className="text-base font-semibold">Social Links</h3>

              <Input
                label="LinkedIn"
                icon={<Linkedin className="w-4 h-4 text-blue-600" />}
                value={formData.linkedInUrl}
                onChange={(v) => setFormData({ ...formData, linkedInUrl: v })}
              />

              <Input
                label="GitHub"
                icon={<Github className="w-4 h-4  text-blue-600" />}
                value={formData.githubUrl}
                onChange={(v) => setFormData({ ...formData, githubUrl: v })}
              />
            </section>

            {/* Bio */}
            <section className="rounded-xl border p-5 bg-gray-50 space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5  text-blue-600" />
                About
              </h3>

              <textarea
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </section>

            {/* Student Info */}
            {user?.role === 'STUDENT' && (
              <section className="rounded-xl border p-5 bg-gray-50 space-y-4">
                <h3 className="text-base font-semibold">Student Information</h3>

                <Input
                  label="College"
                  icon={<Building2 className="w-4 h-4  text-blue-600" />}
                  required
                  value={formData.college}
                  onChange={(v) => setFormData({ ...formData, college: v })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    icon={<MapPin className="w-4 h-4  text-blue-600" />}
                    required
                    value={formData.city}
                    onChange={(v) => setFormData({ ...formData, city: v })}
                  />
                  <Input
                    label="Batch Year"
                    icon={<GraduationCap className="w-4 h-4  text-blue-600" />}
                    required
                    type="number"
                    value={formData.batchYear}
                    onChange={(v) => setFormData({ ...formData, batchYear: v })}
                  />
                </div>
              </section>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t bg-gray-50 -mx-6 px-6 pb-5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */

function Input({
  label,
  value,
  onChange,
  icon,
  required,
  type = 'text',
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
        required={required}
      />
    </div>
  );
}
