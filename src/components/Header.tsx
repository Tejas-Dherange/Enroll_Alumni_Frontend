import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role?.toUpperCase()) {
            case 'ADMIN':
                return '/admin';
            case 'MENTOR':
                return '/mentor';
            case 'STUDENT':
                return '/student';
            default:
                return '/';
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 gradient-primary rounded-lg"></div>
                        <span className="text-xl font-bold text-gray-900">Community Portal</span>
                    </Link>

                    <nav className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600">
                                    Dashboard
                                </Link>
                                <Link to="/announcements" className="text-gray-700 hover:text-primary-600">
                                    Feed
                                </Link>
                                {user?.role?.toUpperCase() === 'STUDENT' && (
                                    <Link to="/messages" className="text-gray-700 hover:text-primary-600">
                                        Messages
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                    <button onClick={handleLogout} className="btn btn-secondary text-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/about" className="text-gray-700 hover:text-primary-600">
                                    About
                                </Link>
                                <Link to="/features" className="text-gray-700 hover:text-primary-600">
                                    Features
                                </Link>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
