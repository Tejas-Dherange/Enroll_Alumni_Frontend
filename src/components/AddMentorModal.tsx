import { useState } from 'react';
import Modal from './Modal';

interface AddMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMentorModal({ isOpen, onClose, onSuccess }: AddMentorModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('All fields are required');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { adminAPI } = await import('../api/admin');
            await adminAPI.addMentor(formData);

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add mentor');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        });
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add New Mentor">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="label">First Name</label>
                    <input
                        type="text"
                        className="input"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Enter first name"
                        required
                    />
                </div>

                <div>
                    <label className="label">Last Name</label>
                    <input
                        type="text"
                        className="input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Enter last name"
                        required
                    />
                </div>

                <div>
                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        required
                    />
                </div>

                <div>
                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength={6}
                    />
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Mentor'}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-secondary flex-1"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
