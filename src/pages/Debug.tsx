import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function Debug() {
    const { user, token, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleClearStorage = () => {
        logout();
        localStorage.clear();
        sessionStorage.clear();
        alert('Storage cleared! Please login again.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Debug Info</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current User Data</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Token</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto break-all">
                        {token || 'No token'}
                    </pre>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Role Info</h2>
                    <div className="space-y-2">
                        <p><strong>Role value:</strong> {user?.role || 'No role'}</p>
                        <p><strong>Role type:</strong> {typeof user?.role}</p>
                        <p><strong>Role uppercase:</strong> {user?.role?.toUpperCase()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Actions</h2>
                    <button
                        onClick={handleClearStorage}
                        className="btn btn-primary"
                    >
                        Clear Storage & Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
