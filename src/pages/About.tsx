// src/pages/About.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Target,
  UserCheck,
  BarChart2,
  Repeat,
  Briefcase,
} from "lucide-react";

import staircase from "../assests/ProcessStep.png";

type Stat = { id: string; label: string; value: number; suffix?: string };

export default function About() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();

  /* -------------------------------
     HANDLE SCROLL REQUEST FROM HEADER
  --------------------------------*/
  useEffect(() => {
    const target =
      (location.state as any)?.scrollTo ||
      (location.hash ? location.hash.replace("#", "") : null);
    if (!target) return;

    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (el) {
        const headerOffset = 80; // adjust based on your header height
        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset -
          headerOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }

      // Clear scroll-state from history
      try {
        const url =
          window.location.pathname +
          window.location.search +
          (location.hash || "");
        window.history.replaceState({}, document.title, url);
      } catch {}
    });
  }, [location]);

  /* -------------------------------
     NUMBER ANIMATION
  --------------------------------*/
  const statsInitial: Stat[] = [
    { id: "students", label: "Students Guided", value: 500, suffix: "+" },
    { id: "mentors", label: "Mentors Available", value: 20, suffix: "+" },
    { id: "updates", label: "Updates Delivered", value: 1000, suffix: "+" },
    { id: "colleges", label: "Colleges Connected", value: 50, suffix: "+" },
  ];
  const [animatedNums, setAnimatedNums] = useState(statsInitial.map(() => 0));

  useEffect(() => {
    if (!mounted) return;

    let rafId: number | null = null;
    const duration = 1200;
    const start = performance.now();
    const from = statsInitial.map(() => 0);
    const to = statsInitial.map((s) => s.value);

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = to.map((t, i) =>
        Math.floor(from[i] + (t - from[i]) * eased)
      );
      setAnimatedNums(next);

      if (progress < 1) rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => rafId && cancelAnimationFrame(rafId);
  }, [mounted]);

  /* -------------------------------
     INTERSECTION OBSERVER 
  --------------------------------*/
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      const t = setTimeout(() => setMounted(true), 200);
      return () => clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      id="about"
      className="bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* ---------------- TAG + TITLE ---------------- */}
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
            About Us
          </span>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 transition-all duration-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3"
            }`}
          >
            Why CollegeMitra?
          </h1>

          <p
            className={`mt-3 text-lg text-slate-600 max-w-2xl mx-auto transition-opacity duration-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            You trusted EnrollEngineer for your counseling. Now trust CollegeMitra
            for your career.
          </p>
        </div>

        {/* ---------------- STAIRCASE + RIGHT INFO ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          {/* Left Image Card */}
          <div
            className={`transition-all duration-700 ${
              mounted
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-6"
            }`}
          >
            <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 hover:shadow-2xl transition">
              <img
                src={staircase}
                alt="Journey"
                className="w-full rounded-2xl"
              />
            </div>
          </div>

          {/* Right Text */}
          <div
            className={`transition-all duration-700 ${
              mounted
                ? "opacity-100 -translate-x-0"
                : "opacity-0 -translate-x-6"
            }`}
          >
            <p className="text-slate-700 leading-relaxed mb-4">
              Engineering is not just about attending classes; it's about exposure.
              Most students get stuck inside a college bubble.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              Whether you're in COEP, PICT, PCCOE, or any college in Maharashtra —
              CollegeMitra connects you to a much bigger ecosystem.
            </p>

            <ul className="space-y-5">
              <FeatureItem
                Icon={UserCheck}
                title="Mentor Access"
                subtitle="1-on-1 guidance for projects and career decisions."
              />

              <FeatureItem
                Icon={Briefcase}
                title="Skill Development"
                subtitle="Bootcamps, hackathons and workshops."
              />

              <FeatureItem
                Icon={BarChart2}
                title="Career Outcomes"
                subtitle="Placement-focused support that gets real results."
              />
            </ul>
          </div>
        </div>

        {/* ---------------- WHY STUDENTS CHOOSE US ---------------- */}
        <div className="mb-16">
            <h3
              className={`text-3xl font-bold text-center mb-10 transition-all duration-700 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              Why Students Choose Our Programs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StyledCard
                title="Targeted Guidance"
                subtitle="Plans tailored to your goals"
                Icon={Target}
              />
              <StyledCard
                title="Expert Counselors"
                subtitle="Learn from top mentors"
                Icon={UserCheck}
              />
              <StyledCard
                title="Proven Results"
                subtitle="98% student satisfaction"
                Icon={BarChart2}
              />
              <StyledCard
                title="Ongoing Support"
                subtitle="Always with you"
                Icon={Repeat}
              />
            </div>
          </div>


        {/* ---------------- WHY COLLEGEMITRA DIFFERENCE BOX ---------------- */}
        <div className="mb-20">
          <div
            className={`rounded-3xl p-10 shadow-xl border bg-white/90 backdrop-blur-sm max-w-4xl mx-auto
              transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } hover:shadow-2xl`}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              What Makes CollegeMitra Different
            </h3>

            <p className="text-slate-600 leading-relaxed text-lg">
              We are a team of alumni, educators, and industry mentors who built
              CollegeMitra to solve the gaps in engineering education — lack of
              mentorship, fragmented opportunities, and poor visibility into
              off-campus roles. Our platform brings together curated guidance,
              verified opportunities, and 1-on-1 mentorship to truly support
              students.
            </p>
          </div>
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-center mb-8">
            Everything You Need to Succeed
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {statsInitial.map((s, i) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition"
              >
                <div className="text-3xl font-extrabold text-indigo-600">
                  {animatedNums[i].toLocaleString()}
                  {s.suffix}
                </div>
                <p className="text-slate-700 mt-2 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/signup"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-semibold"
          >
            Join CollegeMitra
          </Link>
        </div>
      </div>
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function FeatureItem({
  Icon,
  title,
  subtitle,
}: {
  Icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-slate-600 text-sm">{subtitle}</p>
      </div>
    </li>
  );
}

function StyledCard({
  Icon,
  title,
  subtitle,
}: {
  Icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition">
      <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
