import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        About <span className="gradient-primary bg-clip-text text-transparent">Community Portal</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Empowering students, mentors, and administrators to build meaningful connections
                        and foster a thriving learning community.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="mb-20">
                    <div className="card max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            Community Portal is designed to bridge the gap between students, mentors, and administrators,
                            creating a seamless platform for collaboration, guidance, and growth.
                        </p>
                        <p className="text-lg text-gray-700">
                            We believe in the power of community-driven learning, where every member contributes to
                            the collective success through shared knowledge, mentorship, and meaningful interactions.
                        </p>
                    </div>
                </div>

                {/* What We Offer */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card animate-slide-up">
                            <div className="w-16 h-16 gradient-primary rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                S
                            </div>
                            <h3 className="text-xl font-semibold mb-3">For Students</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Connect with mentors for guidance</li>
                                <li>• Share announcements with the community</li>
                                <li>• Discover and network with peers</li>
                                <li>• Access curated learning resources</li>
                            </ul>
                        </div>

                        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="w-16 h-16 gradient-secondary rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                M
                            </div>
                            <h3 className="text-xl font-semibold mb-3">For Mentors</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Guide and support assigned students</li>
                                <li>• Review and approve student content</li>
                                <li>• Broadcast updates and announcements</li>
                                <li>• Foster meaningful connections</li>
                            </ul>
                        </div>

                        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                A
                            </div>
                            <h3 className="text-xl font-semibold mb-3">For Admins</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Manage user registrations and approvals</li>
                                <li>• Assign mentors to students</li>
                                <li>• Send portal-wide announcements</li>
                                <li>• Monitor community health and metrics</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-2">🤝 Collaboration</h3>
                            <p className="text-gray-600">
                                We believe in the power of working together to achieve common goals.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-2">🎯 Excellence</h3>
                            <p className="text-gray-600">
                                We strive for quality in everything we do, from content to connections.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-2">🌱 Growth</h3>
                            <p className="text-gray-600">
                                We foster an environment where everyone can learn and develop.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-2">💡 Innovation</h3>
                            <p className="text-gray-600">
                                We embrace new ideas and approaches to improve our community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="card max-w-2xl mx-auto bg-gradient-to-r from-primary-50 to-secondary-50">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Be part of a vibrant community where learning meets collaboration.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                                Get Started
                            </Link>
                            <Link to="/features" className="btn btn-secondary text-lg px-8 py-3">
                                Explore Features
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
