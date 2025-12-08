import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import eelogo from '../assests/EnrollEngineer logo black.png';
import { useState, useRef, useEffect } from 'react';
import { notificationAPI } from '../api/notifications';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

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

    const getInitials = () => {
        if (!user) return '';
        const firstInitial = user.firstName?.charAt(0) || '';
        const lastInitial = user.lastName?.charAt(0) || '';
        return (firstInitial + lastInitial).toUpperCase();
    };

    const loadNotifications = async () => {
        try {
            const [notifData, countData] = await Promise.all([
                notificationAPI.getNotifications(),
                notificationAPI.getUnreadCount()
            ]);
            setNotifications(notifData);
            setUnreadCount(countData.count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                                    <>
                                        <Link to="/directory" className="text-gray-700 hover:text-primary-600">
                                            Directory
                                        </Link>
                                        <Link to="/messages" className="text-gray-700 hover:text-primary-600">
                                            Messages
                                        </Link>
                                    </>
                                )}

                                {/* Notification Bell */}
                                <div className="relative" ref={notifRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                                            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className="text-xs text-primary-600 hover:text-primary-700"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="overflow-y-auto flex-1">
                                                {notifications.length === 0 ? (
                                                    <p className="text-sm text-gray-500 text-center py-8">No notifications</p>
                                                ) : (
                                                    notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                                            onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                                                                {!notif.isRead && (
                                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {new Date(notif.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow">
                                            {getInitials()}
                                        </div>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user?.firstName} {user?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                                <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role?.toLowerCase()}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
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
