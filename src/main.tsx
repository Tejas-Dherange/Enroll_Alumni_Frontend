import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AnnouncementCreate from './pages/AnnouncementCreate';
import Announcements from './pages/Announcements';
import Messages from './pages/Messages';
import Directory from './pages/Directory';
import About from './pages/About';
import Features from './pages/Features';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mentor"
                            element={
                                <ProtectedRoute allowedRoles={['MENTOR']}>
                                    <MentorDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/student"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/announcements"
                            element={
                                <ProtectedRoute>
                                    <Announcements />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/announcements/create"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <AnnouncementCreate />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/messages"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT', 'MENTOR']}>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/directory"
                            element={
                                <ProtectedRoute>
                                    <Directory />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
