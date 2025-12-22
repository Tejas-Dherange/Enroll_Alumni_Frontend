import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import eelogo from '../assests/EnrollEngineer logo black.png';
import { useState, useRef, useEffect } from 'react';
import { notificationAPI } from '../api/notifications';
import {
  Menu,
  X,
  Bell,
  LogOut,
  RefreshCw,
  LayoutDashboard,
  Rss,
  MessageSquare,
  Users,
  Info,
  Zap,
  LogIn,
  UserPlus,
  ChevronDown,
  FileText
} from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShowMobileMenu(false);
        return;
      }
    }
    navigate('/', { state: { scrollTo: sectionId } });
    setShowMobileMenu(false);
  };

    const handleLogoClick = (e: React.MouseEvent) => {
  e.preventDefault();

  if (!isAuthenticated || !user) {
    navigate('/');
    return;
  }

  switch (user.role?.toUpperCase()) {
    case 'ADMIN':
      navigate('/admin');
      break;
    case 'MENTOR':
      navigate('/mentor');
      break;
    case 'STUDENT':
      navigate('/student');
      break;
    default:
      navigate('/');
  }
};


  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMobileMenu(false);
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
      setNotifications(notifData || []);
      setUnreadCount(countData?.count ?? 0);
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

  // Nav Link Component for consistent styling
  const NavLink = ({ to, icon: Icon, children, onClick }: { to: string, icon?: any, children: React.ReactNode, onClick?: () => void }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/');

    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${isActive
          ? 'text-indigo-600 bg-indigo-50 font-medium'
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
          }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </Link>
    );
  };

  // Mobile Nav Link
  const MobileNavLink = ({ to, icon: Icon, children, onClick }: { to?: string, icon: any, children: React.ReactNode, onClick?: () => void }) => {
    const isActive = to ? (location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/')) : false;

    const Wrapper = to ? Link : 'button';
    const props = to ? { to, onClick: () => { onClick?.(); setShowMobileMenu(false); } } : { onClick: () => { onClick?.(); setShowMobileMenu(false); } };

    return (
      // @ts-ignore
      <Wrapper
        {...props}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-indigo-50 text-indigo-700 font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-base">{children}</span>
      </Wrapper>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled || showMobileMenu
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50'
        : 'bg-white border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

                    {/* Left: Logo */}
                  <Link
                    to="/"
                    onClick={handleLogoClick}
                    className="flex items-center space-x-3 group z-50"
                  >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                            <img
                                src={eelogo}
                                alt="EnrollEngineer logo"
                                className="w-auto h-10 object-contain relative transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                            College Mitra
                        </span>
                    </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to={getDashboardLink()} icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/announcements" icon={Rss}>Feed</NavLink>

                {(user?.role?.toUpperCase() === 'STUDENT' || user?.role?.toUpperCase() === 'MENTOR') && (
                  <NavLink to="/my-announcements" icon={FileText}>My Announcements</NavLink>
                )}

                {user?.role?.toUpperCase() === 'STUDENT' && (
                  <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
                )}

                {user?.role?.toUpperCase() !== 'ADMIN' && user?.role?.toUpperCase() !== 'MENTOR' && (
                  <NavLink to="/directory" icon={Users}>Directory</NavLink>
                )}

                <div className="ml-4 flex items-center space-x-4 pl-4 border-l border-gray-200">
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setShowNotifications((s) => !s)}
                      className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-all duration-200 focus:outline-none"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => loadNotifications()}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="Refresh"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            {unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Bell className="w-6 h-6 text-gray-300" />
                              </div>
                              <p className="text-sm text-gray-500">No new notifications</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-50">
                              {notifications.map((notif: any) => (
                                <div
                                  key={notif.id}
                                  className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                                  onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                >
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {notif.title}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {notif.message}
                                      </p>
                                      <p className="text-[10px] text-gray-400 mt-1.5">
                                        {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ''}
                                      </p>
                                    </div>
                                    {!notif.isRead && (
                                      <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowProfileMenu((s) => !s)}
                      className="flex items-center space-x-2 focus:outline-none group"
                      aria-expanded={showProfileMenu}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white group-hover:shadow-lg transition-all duration-200">
                        {getInitials()}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 mt-2 capitalize border border-indigo-100">
                            {user?.role?.toLowerCase()}
                          </span>
                        </div>
                        <div className="py-1">
                          {/* <Link to="/settings" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Settings className="w-4 h-4" />
                                                        <span>Settings</span>
                                                    </Link> */}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Public Nav Items
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateToSection("about")}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => navigateToSection('features')}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Features
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {/* ===== MOBILE MENU: OVERLAY + LEFT SLIDE PANEL ===== */}

      {/* Dark overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sliding Panel (LEFT) */}
      <div
        className={`md:hidden fixed top-20 left-0 z-50 h-[calc(100vh-5rem)] w-full max-w-md bg-white shadow-xl border-r border-gray-200
      transform transition-transform duration-300 ease-in-out
      ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
  `}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full overflow-y-auto px-4 py-6">

          {/* ANIMATED MENU WRAPPER */}
          <div
            className={`space-y-1 transform transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            {isAuthenticated ? (
              <>
                {/* ITEM 1 */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  <MobileNavLink to={getDashboardLink()} icon={LayoutDashboard}>
                    Dashboard
                  </MobileNavLink>
                </div>

                {/* ITEM 2 */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <MobileNavLink to="/announcements" icon={Rss}>
                    Feed
                  </MobileNavLink>
                </div>

                {/* ITEM 3 – My Announcements */}
                {(user?.role?.toUpperCase() === 'STUDENT' || user?.role?.toUpperCase() === 'MENTOR') && (
                  <div
                    className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                    style={{ transitionDelay: '250ms' }}
                  >
                    <MobileNavLink to="/my-announcements" icon={FileText}>
                      My Announcements
                    </MobileNavLink>
                  </div>
                )}

                {/* ITEM 4 – STUDENTS ONLY: Messages */}
                {user?.role?.toUpperCase() === 'STUDENT' && (
                  <div
                    className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                    style={{ transitionDelay: '300ms' }}
                  >
                    <MobileNavLink to="/messages" icon={MessageSquare}>
                      Messages
                    </MobileNavLink>
                  </div>
                )}

                {/* ITEM 5 – Directory */}
                {user?.role?.toUpperCase() !== 'ADMIN' &&
                  user?.role?.toUpperCase() !== 'MENTOR' && (
                    <div
                      className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                      style={{ transitionDelay: '350ms' }}
                    >
                      <MobileNavLink to="/directory" icon={Users}>
                        Directory
                      </MobileNavLink>
                    </div>
                  )}

                {/* ACCOUNT SECTION */}
                <div
                  className={`mt-6 pt-4 border-t border-gray-200 transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <h4 className="px-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Account
                  </h4>

                  {/* USER CARD */}
                  <div className="flex items-center space-x-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shadow-sm">
                      {getInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <MobileNavLink icon={LogOut} onClick={handleLogout}>
                    Sign out
                  </MobileNavLink>
                </div>
              </>
            ) : (
              <>
                {/* PUBLIC - ITEM 1 */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  <MobileNavLink icon={Info} onClick={() => navigateToSection('about')}>
                    About
                  </MobileNavLink>
                </div>

                {/* PUBLIC - ITEM 2 */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <MobileNavLink icon={Zap} onClick={() => navigateToSection('features')}>
                    Features
                  </MobileNavLink>
                </div>

                <hr className="border-gray-200 my-4" />

                {/* LOGIN */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '250ms' }}
                >
                  <MobileNavLink to="/login" icon={LogIn}>
                    Log In
                  </MobileNavLink>
                </div>

                {/* SIGN UP */}
                <div
                  className={`transition-all duration-500 ${showMobileMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <MobileNavLink to="/signup" icon={UserPlus}>
                    Sign Up
                  </MobileNavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
