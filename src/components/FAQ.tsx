// src/components/FAQ.tsx
import React, { useState } from "react";

type FAQItem = {
    question: string;
    answer: string;
};

const demoFAQ: FAQItem[] = [
    {
        question: "What is the Community Portal?",
        answer:
            "The Community Portal is a platform where students, mentors, and admins can collaborate, share resources, and grow together.",
    },
    {
        question: "How do I join as a student?",
        answer:
            "Simply create an account using the signup option and complete your profile. You will then get access to announcements, mentors, and community posts.",
    },
    {
        question: "How can mentors help students?",
        answer:
            "Mentors can provide guidance, approve content, share expert insights, and help students grow professionally.",
    },
    {
        question: "Is the platform free to use?",
        answer:
            "Yes! Students and mentors can use the platform for free. Admin features depend on your institution’s configuration.",
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section className="py-16 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>

            <div className="space-y-4">
                {demoFAQ.map((item, i) => (
                    <div
                        key={i}
                        className="border border-gray-200 rounded-lg shadow-sm bg-white"
                    >
                        <button
                            onClick={() => toggle(i)}
                            className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                            {item.question}
                            <span className="text-indigo-500 text-xl">
                                {openIndex === i ? "−" : "+"}
                            </span>
                        </button>

                        {openIndex === i && (
                            <div className="px-4 pb-4 text-gray-600 animate-fade-in">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
