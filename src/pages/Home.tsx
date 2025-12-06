import { Link } from 'react-router-dom';
import student from '../assests/student.png';
import mentor from '../assests/mentor.png';
import admin from '../assests/admin.png';
import alumni from '../assests/alumni.png';
import student_lp from '../assests/student_lp.jpg';
import mentor_lp from '../assests/mentor_lp.jpg';
import admin_lp from "../assests/admin_lp.png"
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import FAQ from '../components/FAQ';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div>
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 py-16">

                    {/* LEFT — TEXT SECTION */}
                    <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Welcome to <span className="text-indigo-500">Community Portal</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto md:mx-0 leading-relaxed">
                            Connect, collaborate, and grow together. A platform for students,
                            mentors, and administrators to build a thriving community.
                        </p>
                    </div>

                    {/* RIGHT — IMAGE SECTION */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-fade-in">
                        <div className="relative">

                            {/* Soft background blobs */}
                            <div className="absolute -top-10 -left-10 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-200 rounded-full blur-2xl opacity-40"></div>

                            {/* IMAGE — larger and more prominent */}
                            <img
                                src={alumni}
                                alt="Alumni community"
                                className="
                                    w-[380px] sm:w-[420px] md:w-[500px] lg:w-[600px]
                                    object-cover rounded-3xl shadow-2xl 
                                    border border-indigo-100
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="text-center py-10 animate-fade-in">

                {/* MAIN HEADING – smaller than “Welcome to…” */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                    YOUR <span className="text-indigo-600">NETWORK</span> IS WAITING
                </h1>

                {/* SUBTEXT – soft + small */}
                <h3 className="text-lg md:text-xl text-gray-600 font-medium mb-8">
                    Connect, Grow, Succeed.
                </h3>

                {/* BUTTONS – SAME THEME AS YOUR PREVIOUS CODE */}
                <div className="flex justify-center space-x-5">
                    
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-white text-gray-700 border border-gray-300 
                                rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-all"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-700 text-white 
                                rounded-lg font-medium shadow-md transition-all"
                    >
                        Get Started
                    </Link>

                </div>

            </div>

            </div>




                <div className="mt-20 space-y-20">

                    {/* ---- SECTION 1 (image left, text right) ---- */}
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <img src={student_lp} alt="" className="w-full max-w-sm mx-auto rounded-2xl shadow-lg" />

                        <div>
                            <h3 className="text-2xl font-semibold mb-2">For Students</h3>
                            <p className="text-gray-600">
                                Share announcements, connect with mentors, and engage with your community.
                            </p>
                        </div>
                    </div>

                    {/* ---- SECTION 2 (image right, text left) ---- */}
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-semibold mb-2">For Mentors</h3>
                            <p className="text-gray-600">
                                Guide students, approve content, and foster meaningful connections.
                            </p>
                        </div>

                        <img src={mentor_lp} alt="" className="w-full max-w-sm mx-auto rounded-2xl shadow-lg order-1 md:order-2" />
                    </div>

                    {/* ---- SECTION 3 (image left, text right) ---- */}
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <img src={admin_lp} alt="" className="w-full max-w-sm mx-auto rounded-2xl shadow-lg" />

                        <div>
                            <h3 className="text-2xl font-semibold mb-2">For Admins</h3>
                            <p className="text-gray-600">
                                Manage users, oversee operations, and maintain community standards.
                            </p>
                        </div>
                    </div>

                </div>


                
            </div>
            <div>
                <TestimonialsCarousel />
            </div>

            <div>
                <FAQ />
            </div>
        </div>
    );
}
