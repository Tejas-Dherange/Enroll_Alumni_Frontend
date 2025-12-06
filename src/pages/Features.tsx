import { Link } from 'react-router-dom';

export default function Features() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Platform <span className="gradient-primary bg-clip-text text-transparent">Features</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover the powerful tools and features that make Community Portal
                        the perfect platform for learning and collaboration.
                    </p>
                </div>

                {/* Student Features */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 gradient-primary rounded-lg mr-4"></div>
                        <h2 className="text-3xl font-bold text-gray-900">Student Features</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card animate-slide-up">
                            <h3 className="text-xl font-semibold mb-3">📢 Create Announcements</h3>
                            <p className="text-gray-600">
                                Share updates, achievements, and opportunities with the community.
                                All announcements are reviewed by your assigned mentor before publishing.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <h3 className="text-xl font-semibold mb-3">👥 Student Directory</h3>
                            <p className="text-gray-600">
                                Find and connect with fellow students. Filter by college, city, or batch year
                                to discover peers with similar backgrounds.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-xl font-semibold mb-3">🎓 Mentor Connection</h3>
                            <p className="text-gray-600">
                                Get assigned a dedicated mentor who will guide you, review your content,
                                and provide valuable feedback on your journey.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            <h3 className="text-xl font-semibold mb-3">💬 Direct Messaging</h3>
                            <p className="text-gray-600">
                                Communicate directly with your mentor and other students through
                                our built-in messaging system.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-semibold mb-3">📰 Activity Feed</h3>
                            <p className="text-gray-600">
                                Stay updated with the latest approved announcements and updates
                                from your community and mentors.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
                            <h3 className="text-xl font-semibold mb-3">✅ Approval Tracking</h3>
                            <p className="text-gray-600">
                                Track the status of your announcements - pending, approved, or rejected
                                with detailed feedback from your mentor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mentor Features */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 gradient-secondary rounded-lg mr-4"></div>
                        <h2 className="text-3xl font-bold text-gray-900">Mentor Features</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card animate-slide-up">
                            <h3 className="text-xl font-semibold mb-3">✓ Content Moderation</h3>
                            <p className="text-gray-600">
                                Review and approve or reject announcements from your assigned students.
                                Provide constructive feedback to help them improve.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <h3 className="text-xl font-semibold mb-3">👨‍🎓 Student Management</h3>
                            <p className="text-gray-600">
                                View and manage your assigned students. Monitor their activity,
                                block/unblock users, and maintain community standards.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-xl font-semibold mb-3">📡 Broadcast Updates</h3>
                            <p className="text-gray-600">
                                Send updates to all your assigned students or broadcast messages
                                to all mentors in the platform.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            <h3 className="text-xl font-semibold mb-3">💭 Feedback System</h3>
                            <p className="text-gray-600">
                                Provide detailed feedback when rejecting announcements to help
                                students understand and improve their content.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-semibold mb-3">📊 Student Insights</h3>
                            <p className="text-gray-600">
                                View detailed information about your assigned students including
                                their college, city, batch year, and activity status.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
                            <h3 className="text-xl font-semibold mb-3">🔄 Multi-Batch Sharing</h3>
                            <p className="text-gray-600">
                                When approving quality content, share it across multiple batches
                                to maximize its reach and impact.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Admin Features */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mr-4"></div>
                        <h2 className="text-3xl font-bold text-gray-900">Admin Features</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card animate-slide-up">
                            <h3 className="text-xl font-semibold mb-3">👤 User Management</h3>
                            <p className="text-gray-600">
                                Approve or reject student registrations, manage user accounts,
                                and maintain the quality of your community.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <h3 className="text-xl font-semibold mb-3">🔗 Mentor Assignment</h3>
                            <p className="text-gray-600">
                                Assign mentors to students during the approval process to ensure
                                every student has proper guidance.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-xl font-semibold mb-3">🚫 Block/Unblock Users</h3>
                            <p className="text-gray-600">
                                Maintain community standards by blocking users who violate policies
                                and unblocking them when appropriate.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            <h3 className="text-xl font-semibold mb-3">📢 Portal Announcements</h3>
                            <p className="text-gray-600">
                                Send important announcements to all users with optional email and
                                SMS notifications for critical updates.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-semibold mb-3">📈 Analytics Dashboard</h3>
                            <p className="text-gray-600">
                                View comprehensive statistics about users, announcements, and
                                platform activity to make informed decisions.
                            </p>
                        </div>
                        <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
                            <h3 className="text-xl font-semibold mb-3">🔍 Content Oversight</h3>
                            <p className="text-gray-600">
                                View all announcements across the platform regardless of status
                                to ensure quality and compliance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security & Privacy */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Security & Privacy</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="card text-center">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
                            <p className="text-gray-600">
                                Email verification and secure password management protect your account.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                            <p className="text-gray-600">
                                Strict role-based permissions ensure users only access appropriate features.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-3">✉️</div>
                            <h3 className="text-xl font-semibold mb-2">Email Verification</h3>
                            <p className="text-gray-600">
                                All accounts must verify their email before accessing platform features.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="card max-w-2xl mx-auto bg-gradient-to-r from-primary-50 to-secondary-50">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Join our community today and experience these powerful features firsthand.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                                Sign Up Now
                            </Link>
                            <Link to="/about" className="btn btn-secondary text-lg px-8 py-3">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
