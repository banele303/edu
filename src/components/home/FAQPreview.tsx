import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Is EduNexus aligned with the South African CAPS curriculum?",
    a: "Yes — every feature in EduNexus is purpose-built around CAPS. From timetabling to assessment creation, all content, mark sheets, and report templates are fully aligned to the DBE's curriculum framework for all phases (Foundation, Intermediate, Senior, and FET).",
  },
  {
    q: "How long does it take to set up EduNexus for my school?",
    a: "Most schools are fully operational within 24–48 hours. Our onboarding team walks you through the process: school configuration, bulk learner import, staff setup, and timetabling. We offer free, dedicated onboarding support for every plan.",
  },
  {
    q: "Is my school's data safe and POPIA compliant?",
    a: "Absolutely. EduNexus stores all data on South African servers, uses AES-256 encryption at rest and TLS in transit, and is fully POPIA compliant. We never sell or share your data. Detailed data processing agreements are available on request.",
  },
  {
    q: "Can parents and learners access the platform on mobile?",
    a: "Yes — EduNexus is mobile-first and works seamlessly in any browser on any device. We also offer a low-data mode for areas with limited connectivity, making it accessible to learners and parents in all communities.",
  },
  {
    q: "Do you offer training for teachers and admin staff?",
    a: "All plans include access to our video training library and live onboarding webinars. Professional and District plans also include priority support with a dedicated account manager. On-site training is available for District-tier clients.",
  },
  {
    q: "What happens to our data if we cancel?",
    a: "You own your data. On cancellation you receive a full data export in industry-standard formats (CSV, PDF) within 72 hours. We retain data for 30 days post-cancellation in case you change your mind, then securely delete it.",
  },
];

const FAQPreview = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq-preview" className="py-28 bg-gray-50 dark:bg-[#0f0f0f] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-bold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Questions?{" "}
            <span className="text-[#3ecf8e]">We've Got Answers</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Everything you need to know before getting your school on EduNexus.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-[#1a1a1a] border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === idx
                  ? "border-[#3ecf8e]/40 shadow-lg shadow-[#3ecf8e]/5"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left gap-4"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base pr-4">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    open === idx
                      ? "bg-[#3ecf8e] text-black"
                      : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {open === idx ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === idx ? "max-h-64 pb-6 px-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* See all FAQs link */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Still have questions? Our SA-based support team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/faq"
              className="px-7 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-[#3ecf8e] hover:text-[#3ecf8e] transition-all"
            >
              Browse All FAQs
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 rounded-xl bg-[#3ecf8e] text-black font-bold text-sm hover:bg-[#34b27b] transition-all hover:scale-105 shadow-lg shadow-[#3ecf8e]/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPreview;
