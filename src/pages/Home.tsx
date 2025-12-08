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
      {/* HERO SECTION - gradient background */}
      <section className="relative overflow-hidden">
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-16 py-12 sm:py-16 lg:py-20">

            {/* LEFT - TEXT SECTION */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
                Welcome to <span className="text-indigo-500">Community Portal</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect, collaborate, and grow together. A platform for students,
                mentors, and administrators to build a thriving community.
              </p>
            </div>

            {/* RIGHT - IMAGE SECTION */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative background blobs */}
                <div className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-40 h-40 sm:w-60 sm:h-60 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-200 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

                {/* Main Image */}
                <img
                  src={alumni}
                  alt="Alumni community"
                  className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-[600px] object-cover rounded-2xl sm:rounded-3xl shadow-2xl border border-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WAVE SVG at bottom - gradient background with cream wave coming UP from bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cream wave coming from the bottom */}
            <path
              d="M0,200 L0,120 C120,120 240,120 360,96 C480,72 600,24 720,32 C840,40 960,120 1080,128 C1200,136 1320,80 1440,56 L1440,200 Z"
              fill="#F7F4EC"
            />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT - on cream background */}
      <div className="bg-[#F7F4EC] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* CTA Section */}
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              YOUR <span className="text-indigo-600">NETWORK</span> IS WAITING
            </h2>

            <h3 className="text-base sm:text-lg md:text-xl text-gray-600 font-medium mb-6 sm:mb-8">
              Connect, Grow, Succeed.
            </h3>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 max-w-md mx-auto sm:max-w-none">
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-all text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Feature Sections */}
          <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-20 pb-12 sm:pb-16 lg:pb-20">
            {/* SECTION 1 - Students */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={student_lp} 
                  alt="Students collaborating" 
                  className="w-full max-w-[300px] sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>

              <div className="text-center md:text-left px-4 sm:px-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  For Students
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  Share announcements, connect with mentors, and engage with your community.
                </p>
              </div>
            </div>

            {/* SECTION 2 - Mentors */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="text-center md:text-left px-4 sm:px-0 order-2 md:order-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  For Mentors
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  Guide students, approve content, and foster meaningful connections.
                </p>
              </div>

              <div className="flex justify-center md:justify-end order-1 md:order-2">
                <img 
                  src={mentor_lp} 
                  alt="Mentors guiding students" 
                  className="w-full max-w-[300px] sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            </div>

            {/* SECTION 3 - Admins */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={admin_lp} 
                  alt="Admin dashboard" 
                  className="w-full max-w-[300px] sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>

              <div className="text-center md:text-left px-4 sm:px-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  For Admins
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  Manage users, oversee operations, and maintain community standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials & FAQ - back to gradient background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <TestimonialsCarousel />
        <FAQ />
      </div>
    </div>
  );
}