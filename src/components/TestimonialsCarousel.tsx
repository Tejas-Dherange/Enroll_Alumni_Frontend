// src/components/TestimonialsCarousel.tsx
import React, { useMemo, useState } from "react";

export type Testimonial = {
  id: string | number;
  quote: string;
  name: string;
  meta?: string;
  avatar?: string;
};

export interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  speedPerCard?: number; // seconds per card (lower -> faster)
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "I am Yash Jadhav, and I sincerely thank you for your proper guidance and constant support throughout my admission journey. With your help, I secured admission into VJTI – Civil Engineering. Your timely advice, motivation, and expert guidance made this possible. I am truly grateful and wish the entire Enroll Engineering team continued success in helping many more students achieve their dreams.",
    name: "Yash Jadhav",
    meta: "Premium Batch Student, VJTI Mumbai",
    avatar: "",
  },
  {
    id: 2,
    quote:
      "At time of CET cap round Enroll Enginners help me alot. Because of their guidance and personal attention to individual I am able to get Good College in first Cap round itself. Thank you Enroll Enginners.",
    name: "Asad Pathan",
    meta: "Standard Batch Student, COEP Pune",
    avatar: "",
  },
  {
    id: 3,
    quote:
      "My experience about EnrollEngineer team - very supportive team work and good guidance about admission and also career...and EnrollEngineer team is always available for students issues related admission and college. Thank you EnrollEngineer for all your support and guidance...!!",
    name: "Rutuja Kale",
    meta: "Premium Batch Student, Sinhgad College of Engineering, Vadgaon",
    avatar: "",
  },
  {
    id: 4,
    quote:
      "This achievement wouldn’t have been possible without your timely advice, motivation, and expert guidance. I am truly grateful for your efforts and wish the entire Enroll Engineering team continued success in guiding many more students like me toward their dreams.",
    name: "Komal Wakade",
    meta: "Premium Batch Student, Dr.DY Patil Institute of Technology-Pimpri",
    avatar: "",
  },
  {
    id: 5,
    quote:
      "I had a very good experience with my counselor during my engineering admission process. They guided me step by step, explained the CAP rounds clearly, and helped me shortlist the best colleges according to my percentile. Their advice made the process smooth and stress-free. I really appreciate their patience and support.",
    name: "Akshata Birdar",
    meta: "Premium Batch Student, Sinhgad Academy of Engineering Kondhwa(Bk.)",
    avatar: "",
  },
];

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  speedPerCard = 6,
  className = "",
}: TestimonialsCarouselProps) {
  const items = testimonials ?? [];
  const total = items.length;
  const [hovering, setHovering] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  if (!items || items.length === 0) return null;

  // duration for full marquee loop (seconds)
  // ensure minimum so things don't get too fast on small lists
  const duration = Math.max(8, total * speedPerCard);

  // duplicate items for continuous scroll
  const doubled = useMemo(() => {
    if (total <= 1) return Array.from({ length: 8 }).flatMap(() => items);
    return [...items, ...items];
  }, [items, total]);

  const paused = hovering || manualPause ? "paused" : "running";

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      aria-label="Alumni testimonials - continuous carousel"
    >
      {/* Inject component-scoped CSS (self-contained) */}
      <style>{`
        /* Variables */
        :root {
          --te-duration: ${duration}s;
          --te-ease: linear;
          --te-card-gap: 1rem;
        }

        /* container */
        .te-section {
          padding-top: 2rem;
          padding-bottom: 2.25rem;
        }

        /* viewport */
        .te-viewport {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        /* soft edge fade panels */
        .te-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 6.5%;
          pointer-events: none;
          z-index: 20;
        }
        .te-edge-left {
          left: 0;
          background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0));
          mix-blend-mode: normal;
          opacity: 0.95;
        }
        .te-edge-right {
          right: 0;
          background: linear-gradient(270deg, rgba(255,255,255,1), rgba(255,255,255,0));
          opacity: 0.95;
        }

        /* marquee track - sliding the track left by 50% creates loop since content duplicated */
        .te-track {
          display: inline-flex;
          gap: var(--te-card-gap);
          align-items: stretch;
          will-change: transform;
          animation: te-marquee var(--te-duration) var(--te-ease) infinite;
          animation-play-state: ${paused};
        }

        @keyframes te-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* reduce motion respects user preference */
        @media (prefers-reduced-motion: reduce) {
          .te-track { animation: none !important; }
        }

        /* single testimonial card */
        .te-card {
          display: inline-flex;
          vertical-align: top;
          align-items: stretch;
          background: linear-gradient(180deg, white 0%, #fbfbff 100%);
          border-radius: 1rem;
          border: 1px solid rgba(99,102,241,0.06);
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
          padding: 1.25rem;
          min-height: 220px;
          width: min(360px, 89%);
          transition: transform 300ms cubic-bezier(.2,.9,.2,1), box-shadow 250ms;
        }

        /* responsive card widths (so number of visible cards is natural) */
        @media (min-width: 640px) {
          .te-card { width: min(420px, 46%); }
        }
        @media (min-width: 1024px) {
          .te-card { width: 360px; }
        }
        @media (min-width: 1280px) {
          .te-card { width: 420px; }
        }

        .te-card:focus-within, .te-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.12);
        }

        .te-blockquote {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;
        }

        .te-quote-mark {
          font-size: 48px;
          line-height: 1;
          color: rgba(99,102,241,0.12);
          font-weight: 700;
        }

        .te-quote {
          color: #334155; /* slate-700 */
          font-size: 0.98rem;
          line-height: 1.5;
          margin-top: 0.5rem;
          white-space: normal;
          word-break: break-word;
        }

        .te-divider {
          height: 6px;
          width: 72px;
          margin: 0.85rem auto;
          border-radius: 999px;
          background: linear-gradient(90deg,#6366f1 0%, #7c3aed 100%);
        }

        .te-footer {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.5rem;
        }

        .te-avatar {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid rgba(124,58,237,0.08);
        }

        .te-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .te-author {
          font-weight: 600;
          color: #0f172a; /* slate-900 */
        }

        .te-meta {
          font-size: 0.85rem;
          color: #475569; /* slate-600 */
        }

        /* floating decorative quotes in corners */
        .te-quote-decor {
          position: absolute;
          font-size: 40px;
          color: rgba(99,102,241,0.08);
          z-index: 5;
        }
        .te-quote-decor.right { right: 10px; bottom: 10px; transform: rotate(15deg); }
        .te-quote-decor.left { left: 10px; top: 10px; transform: rotate(-10deg); }

        /* utility: container for marquee track to center vertical paddings */
        .te-track-wrap {
          padding: 0.25rem 0.75rem;
        }

        /* make each card keyboard-focusable for accessibility */
        .te-card:focus { outline: 3px solid rgba(99,102,241,0.18); outline-offset: 3px; }

        /* ensure doubled items line-break correctly on tiny widths */
        .te-track > * { flex-shrink: 0; }

      `}</style>

      <div className="te-section">
        {/* heading */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">What Our Students Say</h3>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Real student experiences from our batches.</p>
        </div>

        {/* marquee viewport */}
        <div
          className="te-viewport max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          role="region"
          aria-roledescription="carousel"
        >
          {/* edge fades */}
          <div className="te-edge te-edge-left" aria-hidden="true" />
          <div className="te-edge te-edge-right" aria-hidden="true" />

          <div className="te-track-wrap">
            <div
              className="te-track"
              style={{
                // CSS variables allow dynamic pause control via inline style if needed
                // but animation-play-state handled by internal CSS with paused variable earlier
                // still expose duration style to keep it explicit
                animationPlayState: paused,
                animationDuration: `${duration}s`,
              }}
              // click to temporarily pause so user can read
              onClick={() => {
                setManualPause(true);
                window.setTimeout(() => setManualPause(false), 1800);
              }}
            >
              {doubled.map((t, i) => {
                const keyId = `${t.id ?? i}-${i}`;
                return (
                  <article
                    key={keyId}
                    className="te-card"
                    role="article"
                    aria-label={`Testimonial by ${t.name}`}
                    tabIndex={0}
                  >
                    <blockquote className="te-blockquote relative">
                      <div className="te-quote-decor left" aria-hidden>
                        “
                      </div>

                      <div>
                        <div className="te-quote-mark" aria-hidden>
                          “
                        </div>

                        <p className="te-quote">
                          {t.quote}
                        </p>

                        <div className="te-divider" aria-hidden />
                      </div>

                      <footer className="te-footer">
                        <div className="te-avatar" aria-hidden>
                          <img
                            src={
                              t.avatar && t.avatar.trim() !== ""
                                ? t.avatar
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    t.name
                                  )}&background=7c3aed&color=fff&size=256`
                            }
                            alt={t.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                t.name
                              )}&background=7c3aed&color=fff&size=256`;
                            }}
                          />
                        </div>

                        <div>
                          <div className="te-author">{t.name}</div>
                          {t.meta && <div className="te-meta">{t.meta}</div>}
                        </div>
                      </footer>

                      <div className="te-quote-decor right" aria-hidden>
                        ”
                      </div>
                    </blockquote>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
