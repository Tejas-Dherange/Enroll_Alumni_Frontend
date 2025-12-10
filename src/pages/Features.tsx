// src/components/FeaturesSection.tsx
import React, { useEffect, useRef, useState } from "react";
import HowToAccess from "../assests/HowToAccess.png";
import {
  Briefcase,
  Users,
  Share2,
  Trophy,
  Megaphone,
  BookOpenCheck,
  CheckCircle,
} from "lucide-react";

type Feature = {
  id: string;
  title: string;
  desc: string;
  Icon: React.ComponentType<any>;
};

const features: Feature[] = [
  {
    id: "jobs",
    title: "Job & Internship Radar",
    desc:
      "Don't rely on campus placements alone. Get real-time alerts for off-campus drives, internships, and startups hiring freshers.",
    Icon: Briefcase,
  },
  {
    id: "mentor",
    title: "Mentor Access",
    desc:
      "Stuck on a project? Need career advice? Chat directly with assigned mentors and industry seniors who guide you 1-on-1.",
    Icon: Users,
  },
  {
    id: "peer",
    title: "Peer Network",
    desc:
      "Find out what's happening in other colleges. Connect with peers from your batch across different institutes to share notes and ideas.",
    Icon: Share2,
  },
  {
    id: "competitions",
    title: "Competitions & Hackathons",
    desc:
      "Get exclusive invites to EnrollEngineer hackathons and coding competitions. Build your resume before you graduate.",
    Icon: Trophy,
  },
  {
    id: "announcements",
    title: "Community Announcements",
    desc:
      "Admins broadcast crucial updates about university news, exam tips, and scholarship opportunities directly to your dashboard.",
    Icon: Megaphone,
  },
  {
    id: "skills",
    title: "Skill Development",
    desc:
      "Access curated training resources and workshops designed to bridge the gap between your syllabus and industry requirements.",
    Icon: BookOpenCheck,
  },
];

function FeatureCard({ feature, visible }: { feature: Feature; visible: boolean }) {
  const { Icon, title, desc } = feature;
  return (
    <article
      className={`bg-white rounded-xl border border-indigo-50 shadow-sm p-6 flex flex-col gap-4 transform transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed flex-1">{desc}</p>
    </article>
  );
}

export default function Features() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    // full-width background
    <section id="features" ref={ref} className="w-full bg-[#EEF7FF] py-12 lg:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* TAG + Header */}
        <div className="text-center mb-6">
          <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            Features
          </span>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need to <span className="text-indigo-600">Succeed</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            From your first year to your final placement, CollegeMitra has a module for every step
            of your journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.id} feature={f} visible={visible} />
          ))}
        </div>

        {/* -- HOW TO ACCESS / IMAGE BLOCK -- */}
        <div
          className={`mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Image column */}
            <div className="md:col-span-7 p-6 flex items-center justify-center bg-white">
              <img
                src={HowToAccess}
                alt="How to access steps"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Content column */}
            <div className="md:col-span-5 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Join the Portal</h3>
              <p className="text-sm text-slate-600 mb-6">
                Follow these quick steps to register, get verified, and access your personalized dashboard.
              </p>

              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Register as a Student</h4>
                    <p className="text-xs text-slate-600">
                      Click "Student Sign Up" and fill in your details including your College Name and
                      Batch Year.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Admin Verification</h4>
                    <p className="text-xs text-slate-600">
                      To keep the community safe and exclusive, our Admin team verifies your details. This usually takes 24 hours.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Get Assigned a Mentor</h4>
                    <p className="text-xs text-slate-600">
                      Once approved, you are automatically assigned a mentor based on your branch and interests.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Access Dashboard</h4>
                    <p className="text-xs text-slate-600">
                      Log in to access your personalized dashboard, update feed, and start networking!
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 flex items-center gap-4">
                <a
                  href="/signup"
                  className="inline-block px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
                >
                  Student Sign Up
                </a>
                <a
                  href="/login"
                  className="inline-block px-4 py-2 rounded-md border border-indigo-100 text-indigo-700 font-medium hover:bg-indigo-50 transition"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* end container */}
      </div>
    </section>
  );
}
