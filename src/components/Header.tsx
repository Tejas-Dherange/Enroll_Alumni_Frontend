import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import eelogo from '../assests/EnrollEngineer logo black.png';

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
            case 'ADMIN': return '/admin';
            case 'MENTOR': return '/mentor';
            case 'STUDENT': return '/student';
            default: return '/';
        }
    };

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* FLEX CONTAINER */}
                <div className="flex items-center justify-between h-16">

                    {/* LEFT: LOGO + NAME */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img 
                            src={eelogo} 
                            alt="EnrollEngineer logo" 
                            className="w-20 h-12 object-contain"
                        />
                        <span className="text-xl font-bold text-gray-900">
                            Community Portal
                        </span>
                    </Link>

                    {/* RIGHT SIDE: NAV + USER + LOGOUT */}
                    <nav className="flex items-center space-x-6">

                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to={getDashboardLink()} 
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Dashboard
                                </Link>

                                <Link 
                                    to="/announcements" 
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Feed
                                </Link>

                                {user?.role?.toUpperCase() === 'STUDENT' && (
                                    <Link 
                                        to="/messages" 
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Messages
                                    </Link>
                                )}

                                {/* USER INFO + LOGOUT ON FAR RIGHT */}
                                <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {user?.firstName} {user?.lastName}
                                    </span>

                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 
                                                text-white rounded-lg text-sm font-medium transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/about" 
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    About
                                </Link>

                                <Link 
                                    to="/features" 
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Features
                                </Link>

                                <Link 
                                    to="/login" 
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 
                                            text-white rounded-lg text-sm font-medium transition"
                                >
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
