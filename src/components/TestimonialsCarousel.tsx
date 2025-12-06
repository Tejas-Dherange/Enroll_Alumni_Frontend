// TestimonialsCarousel.tsx
import React, { useEffect, useRef, useState } from "react";

export type Testimonial = {
  id: string | number;
  quote: string;
  name: string;
  meta?: string;
  avatar?: string; // url to avatar image
};

export interface TestimonialsCarouselProps {
  testimonials?: Testimonial[]; // optional, will use built-in sample data if not provided
  interval?: number; // autoplay interval in ms
  startIndex?: number;
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "I am incredibly thankful to Enroll Engineer for guiding me through the challenging process of choosing the right college and navigating the CAP rounds. Their team was highly professional, knowledgeable, and always available to resolve my queries.",
    name: "Gitesh Patil",
    meta: "Premium Batch Student, SPIT Mumbai",
    avatar: "",
  },
  {
    id: 2,
    quote:
      "EnrollEngineer is best counseling platform i have ever seen, they show me the reality while others confused you for admisison process. They helped me to get admission best college from beginning till last. Because of EnrollEngineer team it got possible for me to get admission in Best College of Pune for B.Tech CSE",
    name: "Om Pachpande",
    meta: "Premium Batch Student, DES Pune University",
    avatar: "",
  },
  {
    id: 3,
    quote:
      "My name is Gayatri Gaikwad, EnrollEngineer is very helpful for admission. Your team is very good at helping students make their careers in right way. Doubts from team are becoming very clear ,all doubts clear properly.",
    name: "Gayatri Gaikwad",
    meta: "Standard Batch Student, Zeal COE&R Pune",
    avatar: "",
  },
  {
    id: 4,
    quote:
      "EnrollEngineer made my admission process smooth and hassle-free. With their expert guidance, I secured admission to PICT for Computer Science. Their team was always supportive, answering all my questions and helping me make the right decision. I’m really thankful for their efforts and highly recommend their services to other students!",
    name: "Om Kulte",
    meta: "Premium Batch Student, PICT Pune",
    avatar: "",
  },
  {
    id: 5,
    quote:
      "EnrollEngineer provided amazing support throughout my admission journey, guiding me every step of the way. They helped me secure admission to VIT for CSE (Software) during the spot round. Their dedication and expert advice made the process stress-free. I’m truly grateful for their assistance and highly recommend them!",
    name: "Tanmay Patil",
    meta: "Premium Batch Student, VIT Pune",
    avatar: "",
  },
];

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  interval = 5000,
  startIndex = 0,
  className = "",
}: TestimonialsCarouselProps) {
  const [index, setIndex] = useState<number>(() => {
    const safe = Math.max(0, Math.min(startIndex, testimonials.length - 1));
    return safe;
  });
  const [paused, setPaused] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const total = testimonials.length;

  useEffect(() => {
    // autoplay
    if (!paused && total > 1) {
      timerRef.current = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % total);
      }, interval);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paused, interval, total]);

  useEffect(() => {
    // if testimonials length changes, clamp index
    if (index >= total) {
      setIndex(total - 1 >= 0 ? total - 1 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goTo = (i: number) => {
    const normalized = ((i % total) + total) % total;
    setIndex(normalized);
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  if (total === 0) return null;

  return (
    <section
      className={`w-full bg-white py-12 ${className}`}
      aria-label="Alumni testimonials"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            What Our Students Say
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mx-auto mt-2"></div>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our students have to say
            about our guidance.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="mt-10 relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Card viewport */}
          <div className="flex items-center justify-center">
            <div className="w-full sm:w-11/12 lg:w-10/12">
              {/* Each testimonial is absolutely positioned and animated via opacity/translate */}
              <div className="relative h-64 sm:h-56 md:h-72">
                {testimonials.map((t, i) => {
                  const active = i === index;
                  return (
                    <article
                      key={t.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out
                        ${active ? "opacity-100 translate-y-0 z-10" : "opacity-0 -translate-y-6 z-0"}
                      `}
                      aria-hidden={!active}
                    >
                      <div className="h-full flex flex-col items-center justify-center">
                        <blockquote className="bg-white w-full rounded-2xl p-6 sm:p-10 shadow-xl relative">
                          {/* Decorative left quote */}
                          <div className="absolute left-6 top-6 text-indigo-100 text-6xl select-none pointer-events-none">
                            “
                          </div>

                          <p className="text-base sm:text-xl leading-relaxed text-gray-700 text-center">
                            {t.quote}
                          </p>

                          <footer className="mt-6 sm:mt-8 flex items-center justify-center space-x-4">
                            <img
                              src={t.avatar}
                              alt={`${t.name} avatar`}
                              className="w-14 h-14 rounded-full border-2 border-indigo-100 object-cover"
                            />
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">{t.name}</div>
                              {t.meta && (
                                <div className="text-sm text-gray-500">{t.meta}</div>
                              )}
                            </div>
                          </footer>

                          {/* Decorative right quote */}
                          <div className="absolute right-6 bottom-6 text-indigo-100 text-4xl select-none pointer-events-none">
                            ”
                          </div>
                        </blockquote>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Prev/Next controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 pointer-events-none">
            <button
              type="button"
              onClick={prev}
              className="pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full p-2 shadow"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              className="pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full p-2 shadow"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full transition-all focus:outline-none ${
                  i === index ? "bg-indigo-600 w-3.5 h-3.5" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
