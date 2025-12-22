import React from "react";
import logo from "../assests/EnrollEngineer logo white.png";
import { Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer({ className = "" }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative w-full bg-[#061023] text-gray-300 mt-auto overflow-hidden ${className}`}
    >

      {/* ===== Footer content (pulled up so wave overlaps) ===== */}
      <div className="relative z-20 w-full px-6 sm:px-8 lg:px-12 pt-10 sm:pt-12 md:pt-14 pb-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* COLUMN 1 - BRAND */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <img
                    src={logo}
                    alt="EnrollEngineer logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-indigo-400 font-semibold text-lg">
                  EnrollEngineer
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Carrer guidance you can access anywhere — fast and reliable.
              </p>

              <div className="flex items-center space-x-3">
                <a
                  href="https://www.instagram.com/enrollengineer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="EnrollEngineer on Instagram"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500 transition"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" aria-hidden />
                  <span className="sr-only">Instagram</span>
                </a>

                <a
                  href="https://www.linkedin.com/company/engiedge/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="EnrollEngineer on LinkedIn"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500 transition"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" aria-hidden />
                  <span className="sr-only">LinkedIn</span>
                </a>

                <a
                  href="https://www.youtube.com/@enrollengineer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="EnrollEngineer on YouTube"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500 transition"
                >
                  <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" aria-hidden />
                  <span className="sr-only">YouTube</span>
                </a>
              </div>
            </div>

            {/* COLUMN 2 - POLICIES */}
            <div>
              <h4 className="text-white font-semibold mb-4">Our Policies</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 transition text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 transition text-sm">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 transition text-sm">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 - CONTACT */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>

              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start sm:items-center space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="hover:text-gray-200 transition text-sm">Pune, Maharashtra, India</span>
                </li>

                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <a href="tel:+918446777225" className="hover:text-gray-200 transition text-sm">
                    +91 8446777225
                  </a>
                </li>

                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <a
                    href="mailto:support@enrollengineer.in"
                    className="hover:text-gray-200 transition text-sm break-words"
                  >
                    support@enrollengineer.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/5 mt-8 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-gray-400 text-sm text-center md:text-left">© {year} EnrollEngineer. All rights reserved.</p>

              {/* <p className="text-gray-400 text-sm text-center md:text-right">
                Built with <span className="text-pink-500">♥</span> by{" "}
                <span className="text-indigo-400 ml-1">@EnrollEngineer</span>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
