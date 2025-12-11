import React, { useEffect, useMemo, useRef, useState } from "react";

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
  const items = testimonials;
  const total = items.length;
  const [hovering, setHovering] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  // duration in seconds for the entire duplicated track to scroll - prevents extremely fast by min cap
  const duration = Math.max(8, total * speedPerCard);

  // duplicate items for seamless loop
  const doubled = useMemo(() => {
    if (total <= 1) return Array.from({ length: 6 }).flatMap(() => items);
    return [...items, ...items];
  }, [items, total]);

  const paused = hovering || manualPause;

  if (!items || items.length === 0) return null;

  return (
    <section className={`relative overflow-hidden ${className}`} aria-label="Alumni testimonials - continuous carousel">
      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">What Our Students Say</h3>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Real student experiences from our batches.</p>
        </div>
      </div>

      {/* Marquee viewport */}
      <div
        className="testi-marquee-viewport relative z-10"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        style={
          {
            ["--marquee-duration" as any]: `${duration}s`,
            ["--marquee-paused" as any]: paused ? "paused" : "running",
          } as React.CSSProperties
        }
      >
        {/* left and right soft fades (optional) */}
        <div className="edge-fade edge-fade-left pointer-events-none" />
        <div className="edge-fade edge-fade-right pointer-events-none" />

        {/* track */}
        <div
          className="testi-marquee-track"
          onClick={() => {
            // quick manual pause when user clicks a card so they can read
            setManualPause(true);
            window.setTimeout(() => setManualPause(false), 2000);
          }}
        >
          {doubled.map((t, i) => {
            const keyId = `${t.id ?? i}-${i}`;
            return (
              <article key={keyId} className="testi-card inline-block align-top" role="article" aria-label={`Testimonial by ${t.name}`}>
                <blockquote className="card-blockquote flex flex-col justify-between h-full bg-white rounded-2xl p-8 shadow-md border border-indigo-50 relative">
                  {/* top: quote */}
                  <div>
                    <div className="float-quote float-left">“</div>


                    {/* IMPORTANT: the text container must allow wrapping; use whitespace-normal and break-words */}
                    <p className="quote-text text-gray-700 text-base leading-relaxed mt-3 mb-4 whitespace-normal break-words">
                      {t.quote}
                    </p>

                    <div className="divider w-20 h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mx-auto my-2" />
                  </div>

                  {/* footer: avatar + author */}
                  <footer className="card-footer mt-4">
                    <div className="avatar-container">
                      <img
                        src={
                          t.avatar && t.avatar.trim() !== ""
                            ? t.avatar
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                t.name
                              )}&background=7c3aed&color=fff&size=128`
                        }
                        alt={t.name}
                        className="avatar-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            t.name
                          )}&background=7c3aed&color=fff&size=128`;
                        }}
                      />
                    </div>

                    <div className="author-meta">
                      <div className="author-name">{t.name}</div>
                      {t.meta && <div className="author-role">{t.meta}</div>}
                    </div>
                  </footer>


                  <div className="float-quote float-right">”</div>

                </blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
