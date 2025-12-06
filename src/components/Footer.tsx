import logo from "../assests/EnrollEngineer logo white.png"

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#061023] text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* TOP CONTENT (3 COLUMNS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* COLUMN 1 - BRAND */}
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            {/* Logo Icon */}
                            <div className="h-12 w-12">
                                <img src={logo} alt="" />
                            </div>

                            <span className="text-indigo-400 font-semibold text-lg">
                                EnrollEngineer
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            Admission Guidance you can access anywhere easily!
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center space-x-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                                <i className="fa-brands fa-instagram text-gray-200"></i>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                                <i className="fa-brands fa-linkedin text-gray-200"></i>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                                <i className="fa-brands fa-youtube text-gray-200"></i>
                            </a>
                        </div>
                    </div>

                    {/* COLUMN 2 - POLICIES */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Our Policies</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-gray-200 transition">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gray-200 transition">Terms and Conditions</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gray-200 transition">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* COLUMN 3 - CONTACT */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>

                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center space-x-3">
                                <i className="fa-solid fa-location-dot text-indigo-400"></i>
                                <span>Pune, Maharashtra, India</span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <i className="fa-solid fa-phone text-indigo-400"></i>
                                <a href="tel:+918446777225" className="hover:text-gray-200 transition">
                                    +91 8446777225
                                </a>
                            </li>

                            <li className="flex items-center space-x-3">
                                <i className="fa-solid fa-envelope text-indigo-400"></i>
                                <a href="mailto:communications@enrollengineer.com" className="hover:text-gray-200 transition">
                                    communications@enrollengineer.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-gray-400 text-sm">
                        © {year} EnrollEngineer. All rights reserved.
                    </p>

                    <p className="text-gray-400 text-sm">
                        Built with <span className="text-pink-500">♥</span> by
                        <span className="text-indigo-400 ml-1">@EnrollEngineer</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
