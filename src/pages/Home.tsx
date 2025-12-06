import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="gradient-primary bg-clip-text text-transparent">Community Portal</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Connect, collaborate, and grow together. A platform for students, mentors, and administrators
                        to build a thriving community.
                    </p>

                    <div className="flex justify-center space-x-4">
                        <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                            Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                            Login
                        </Link>
                    </div>
                </div>

                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    <div className="card animate-slide-up">
                        <div className="w-12 h-12 gradient-primary rounded-lg mb-4"></div>
                        <h3 className="text-xl font-semibold mb-2">For Students</h3>
                        <p className="text-gray-600">
                            Share announcements, connect with mentors, and engage with your community.
                        </p>
                    </div>

                    <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-12 h-12 gradient-secondary rounded-lg mb-4"></div>
                        <h3 className="text-xl font-semibold mb-2">For Mentors</h3>
                        <p className="text-gray-600">
                            Guide students, approve content, and foster meaningful connections.
                        </p>
                    </div>

                    <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4"></div>
                        <h3 className="text-xl font-semibold mb-2">For Admins</h3>
                        <p className="text-gray-600">
                            Manage users, oversee operations, and maintain community standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
