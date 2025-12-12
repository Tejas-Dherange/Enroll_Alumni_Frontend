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
import WhyUsImg from "../assests/WhyUsSection.png";
import transformBg from "../assests/black-bg.jpg";

import statImg1 from "../assests/student.png";
import statImg2 from "../assests/mentor.png";
import statImg3 from "../assests/updates.png";
import statImg4 from "../assests/college.png";

type Stat = { id: string; label: string; value: string; img?: string };

/* ----------------- Flip tuning (keeps for other components) ----------------- */
const FLIP_DURATION = 600;
const FLIP_EASING = "cubic-bezier(.22,.9,.28,1)";

/* -------------------------- About Page -------------------------- */
export default function About() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const target =
      (location.state as any)?.scrollTo ||
      (location.hash ? location.hash.replace("#", "") : null);
    if (!target) return;

    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (el) {
        const headerOffset = 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      try {
        const url = window.location.pathname + window.location.search + (location.hash || "");
        window.history.replaceState({}, document.title, url);
      } catch { }
    });
  }, [location]);

  /* stats just used elsewhere — kept minimal */
  const statsInitial: Stat[] = [
    { id: "students", label: "Students Guided", value: "500+", img: statImg1 },
    { id: "mentors", label: "Mentors Available", value: "20+", img: statImg2 },
    { id: "updates", label: "Updates Delivered", value: "1000+", img: statImg3 },
    { id: "colleges", label: "Colleges Connected", value: "50+", img: statImg4 },
  ];

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
    <div id="about" className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* INNER content container (constrained width) */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
            About Us
          </span>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              }`}
          >
            <span className="text-indigo-600">CollegeMitra</span>
          </h1>

          <p
            className={`mt-3 text-lg text-slate-600 max-w-2xl mx-auto transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"
              }`}
          >
            You trusted EnrollEngineer for your counseling. Now trust CollegeMitra for your career.
          </p>
        </div>

        {/* Staircase + features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              }`}
          >
            <div className="rounded-3xl shadow-xl p-4 border border-gray-100 hover:shadow-2xl transition bg-white">
              <img
                src={staircase}
                alt="Journey"
                className="w-full rounded-2xl object-cover"
                style={{ maxHeight: 420 }}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-6"
              }`}
          >
            <p className="text-slate-700 leading-relaxed mb-4">
              Engineering is not just about attending classes; it's about exposure. Most students get stuck inside a college bubble.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              Whether you're in COEP, PICT, PCCOE, or any college in Maharashtra — CollegeMitra connects you to a much bigger ecosystem.
            </p>

            <ul className="space-y-5">
              <FeatureItem Icon={UserCheck} title="Mentor Access" subtitle="1-on-1 guidance for projects and career decisions." />
              <FeatureItem Icon={Briefcase} title="Skill Development" subtitle="Bootcamps, hackathons and workshops." />
              <FeatureItem Icon={BarChart2} title="Career Outcomes" subtitle="Placement-focused support that gets real results." />
            </ul>
          </div>
        </div>

        {/* WhyStudents section (kept) */}
        <div className="mb-16">
          <WhyStudentsSection mounted={mounted} />
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-semibold">Join CollegeMitra</Link>
        </div>
      </div>

      {/* ---------------- Transforming Lives (full-bleed background) ----------------
          Moved OUTSIDE the inner constrained container so the background image spans full width.
          Inner content still constrained via max-w-6xl + px-6 to produce small gaps as requested.
      */}
      <TransformingStats />
    </div>
  );
}

/* ---------------- TransformingStats component (responsive) ----------------
   - Mobile (sm and below): grid 2 cols (2 images first row, 2 images second row)
   - md and up: single-line horizontal row (no wrap) with horizontal scroll if needed
   - Background image is full-bleed; inner content constrained with max-w-6xl and px-6.
------------------------------------------------------------------------- */
function TransformingStats() {
  const transformStats: Stat[] = [
    { id: "t1", label: "Students Mentored", value: "2000+", img: statImg1 },
    { id: "t2", label: "Active Mentors", value: "5+", img: statImg2 },
    { id: "t3", label: "Opportunities Updates", value: "1000+", img: statImg3 },
    { id: "t4", label: "College Covered", value: "50+", img: statImg4 },
  ];

  return (
    <section
      aria-label="Transforming lives"
      className="w-full relative overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${transformBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* constrained inner content for nice left/right gaps */}
      <div className="relative z-10 w-full py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Transforming Lives Since
            </h2>
            <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-yellow-300 tracking-tight mt-3">
              2024
            </div>
          </div>

          {/* MOBILE: grid 2x2 */}
          <div className="grid grid-cols-2 gap-6 md:hidden">
            {transformStats.map((s) => (
              <div key={s.id} className="text-center bg-black/20 rounded-xl p-4">
                <div className="w-full h-28 flex items-center justify-center mb-3">
                  <img src={s.img} alt={s.label} className="max-h-full object-contain" />
                </div>

                <div className="text-white font-extrabold text-lg sm:text-xl leading-tight">
                  {s.value}
                </div>

                <div className="mt-2 text-white/90 text-sm sm:text-base font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP (md+): single-line horizontal row (no wrap) */}
          <div className="hidden md:block">
            <div
              className="flex gap-6 items-start py-6 overflow-x-auto no-scrollbar whitespace-nowrap"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {transformStats.map((s) => (
                <div
                  key={s.id}
                  className="flex-shrink-0 w-44 sm:w-52 md:w-56 lg:w-64 text-center inline-block"
                >
                  <div className="w-full h-36 sm:h-40 md:h-44 flex items-center justify-center mb-3">
                    <img
                      src={s.img}
                      alt={s.label}
                      className="max-h-full object-contain"
                      style={{ width: "auto", height: "100%" }}
                    />
                  </div>

                  <div className="text-white font-extrabold text-lg sm:text-xl leading-tight">
                    {s.value || ""}
                  </div>

                  <div className="mt-2 text-white/90 text-sm sm:text-base font-semibold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        /* small tweak: allow keyboard focus scrolling and hint */
        .no-scrollbar:focus { outline: none; }
      `}</style>
    </section>
  );
}

/* ---------------- WhyStudentsSection (kept from earlier) with responsive tweaks ---------------- */
function WhyStudentsSection({ mounted }: { mounted: boolean }) {
  const cards = [
    { title: "Targeted Guidance", subtitle: "Plans tailored to your goals", Icon: Target },
    { title: "Expert Counselors", subtitle: "Learn from top mentors", Icon: UserCheck },
    { title: "Proven Results", subtitle: "98% student satisfaction", Icon: BarChart2 },
    { title: "Ongoing Support", subtitle: "Always with you", Icon: Repeat },
  ];

  const cardColors = [
    "bg-gradient-to-br from-orange-400 to-orange-500 text-white",
    "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
    "bg-gradient-to-br from-indigo-600 to-violet-600 text-white",
    "bg-gradient-to-br from-pink-500 to-rose-500 text-white",
  ];

  const rightRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rightRef.current;
    if (!el) return;
    const setHeight = () => {
      // make sticky column balanced between mobile and desktop
      if (window.innerWidth >= 1024) {
        el.style.boxSizing = "border-box";
        // allow a sensible max height based on viewport (keeps footer visible)
        el.style.height = `calc(100vh - 220px)`;
        el.style.overflowY = "auto";
        el.style.paddingRight = "12px";
        el.style.paddingBottom = "220px";
      } else {
        el.style.height = "";
        el.style.overflowY = "visible";
        el.style.paddingRight = "";
        el.style.paddingBottom = "";
      }
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  useEffect(() => {
    // capture wheel to scroll right column when section is active — lightweight fallback (kept simple)
    const rightEl = rightRef.current;
    const containerEl = containerRef.current;
    if (!rightEl || !containerEl) return;

    const EPS = 2;
    const handleGlobalWheel = (e: WheelEvent) => {
      // Check if section is in the "active" zone for scrolling
      const rect = containerEl.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // We only hijack if the section is close to the top of the viewport
      // (meaning the user has scrolled TO it)
      // and it hasn't fully scrolled past yet.
      // Threshold: Top is within upper 40% of screen, Bottom is still substantially visible.
      const isCandidate = rect.top < viewHeight * 0.4 && rect.bottom > viewHeight * 0.4;

      if (!isCandidate) return;

      const delta = e.deltaY;
      const atTop = rightEl.scrollTop <= EPS;
      const atBottom = rightEl.scrollTop + rightEl.clientHeight >= rightEl.scrollHeight - EPS;

      // Logic: if we can scroll the inner container in the requested direction, do so and preventDefault.
      // If we are at boundary, let the default behavior (page scroll) happen.
      if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
        e.preventDefault();
        e.stopPropagation();
        rightEl.scrollBy({ top: delta, behavior: "auto" });
      }
    };

    document.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleGlobalWheel);
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT STICKY PANEL */}
        <div className="lg:sticky lg:top-20">
          <div className="relative w-fit mx-auto lg:mx-0 mb-6">
            <h3 className="text-3xl md:text-4xl font-extrabold leading-tight text-center lg:text-left">
              Why <span className="text-indigo-600">CollegeMitra</span>?
            </h3>

            {/* Underline stroke */}
            <svg className="absolute mt-5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-[260px] md:w-[330px] lg:w-[360px] -bottom-3" viewBox="0 0 300 20" fill="none" strokeWidth="6" strokeLinecap="round" aria-hidden>
              <path d="M5 10 C60 5, 140 5, 295 10" stroke="#F28A52" className="animate-draw stroke-[6]" />
            </svg>
          </div>

          <div className="overflow-hidden">
            <img src={WhyUsImg} alt="Why us visual" className="w-full h-auto object-cover block" style={{ maxHeight: 520 }} />
          </div>
        </div>

        {/* RIGHT SIDE: scrollable cards (same layout on all sizes) */}
        <div ref={rightRef} className="space-y-6 pt-2 custom-scroll-free" aria-label="Why choose cards">
          {cards.map((c, idx) => (
            <div key={c.title} className="rounded-3xl overflow-hidden transform transition-all duration-700">
              <div
                className={`p-4 sm:p-6 ${cardColors[idx % cardColors.length]}`}
                style={{ minHeight: 160 }}
              >
                {/* Keep consistent left-icon / right-content layout on all screens.
                    Use flex-nowrap to keep icon and content on single row; reduce sizes on small screens. */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex items-center justify-center flex-shrink-0"
                       style={{ width: 56, height: 56 }}>
                    <div className="w-14 h-14 rounded-xl bg-white/18 flex items-center justify-center">
                      <c.Icon size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-2xl font-bold leading-tight">{c.title}</h4>
                    <p className="text-sm sm:text-md mt-1 opacity-95">{c.subtitle}</p>
                    <p className="text-xs sm:text-sm mt-3 opacity-90 max-w-prose">
                      We provide personalised roadmaps, regular check-ins and resources so you always know the next step.
                    </p>

                    <div className="mt-4">
                      <Link
                        to="/signup"
                        className="inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-md bg-white text-slate-900 font-semibold shadow hover:opacity-95 transition"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scroll-free { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scroll-free::-webkit-scrollbar { display: none; }

        @keyframes draw { 0% { stroke-dasharray: 0 300 } 100% { stroke-dasharray: 300 0 } }
        .animate-draw { stroke-dasharray: 300; animation: draw 1s ease forwards; }

        .flip-init { transform: rotateY(22deg) translateZ(0); opacity: 0; transform-origin: center right; }
        .flip-done { transform: rotateY(0deg) translateZ(0); opacity: 1; transform-origin: center right;
          transition: transform ${FLIP_DURATION}ms ${FLIP_EASING}, opacity ${Math.max(200, FLIP_DURATION / 3)}ms ease;
        }
        .card-inner { backface-visibility: hidden; transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}


/* small helper */
function FeatureItem({ Icon, title, subtitle }: { Icon: any; title: string; subtitle: string }) {
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


