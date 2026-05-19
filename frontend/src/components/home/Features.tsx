import { useState } from "react";
import {
  Brain,
  BarChart3,
  CalendarDays,
  FileText,
  MessageSquare,
  Shield,
  Smartphone,
  Zap,
  CheckCircle2,
} from "lucide-react";

const categories = ["All", "Administration", "Learning", "Communication", "Analytics"];

const features = [
  {
    icon: Brain,
    title: "AI Study Buddy",
    desc: "Personalised AI tutor that adapts to each learner's pace, providing hints, explanations, and practice questions aligned to CAPS.",
    tags: ["Learning"],
    badge: "AI Powered",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    highlights: ["Personalised learning paths", "Instant feedback", "CAPS aligned"],
  },
  {
    icon: BarChart3,
    title: "Grade Insights Dashboard",
    desc: "Real-time analytics for teachers and principals — track performance trends, identify at-risk learners, and celebrate top achievers.",
    tags: ["Analytics"],
    badge: "Real-time",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    highlights: ["Cohort comparisons", "At-risk alerts", "NSC readiness scores"],
  },
  {
    icon: CalendarDays,
    title: "Smart Timetabling",
    desc: "Generate conflict-free, CAPS-aligned school timetables in minutes. Handle teacher availability, room allocation, and phase-based scheduling automatically.",
    tags: ["Administration"],
    badge: "Auto-generate",
    badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
    iconColor: "text-[#3ecf8e]",
    iconBg: "bg-[#3ecf8e]/10",
    highlights: ["Conflict detection", "Room allocation", "Substitute planning"],
  },
  {
    icon: FileText,
    title: "Digital Report Cards",
    desc: "Generate professional DBE-compliant report cards with one click. Supports all phases from Foundation to FET, including SBA tracking.",
    tags: ["Administration"],
    badge: "DBE Compliant",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    highlights: ["One-click generation", "Multi-phase support", "Parent download"],
  },
  {
    icon: MessageSquare,
    title: "Parent Communication Hub",
    desc: "Send announcements, report progress, and manage consent forms — all in one secure, POPIA-compliant messaging platform.",
    tags: ["Communication"],
    badge: "POPIA Compliant",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    highlights: ["Bulk announcements", "Read receipts", "Consent management"],
  },
  {
    icon: Shield,
    title: "Secure Admin Controls",
    desc: "Role-based access for principals, HODs, teachers, and admin staff. Full audit trails and data governance aligned to POPIA regulations.",
    tags: ["Administration"],
    badge: "Enterprise Grade",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    highlights: ["Role-based access", "Full audit trail", "Data encryption"],
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Accessible on any device — teachers can mark attendance on a tablet, parents can track progress on a phone, and learners can study anywhere.",
    tags: ["Learning", "Communication"],
    badge: "Cross-platform",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    highlights: ["iOS & Android", "Offline mode", "Low data mode"],
  },
  {
    icon: Zap,
    title: "Instant Assessment Engine",
    desc: "Create, distribute, and auto-mark quizzes and tests. Supports multiple question types including multiple-choice, short answer, and essay with AI marking.",
    tags: ["Learning", "Analytics"],
    badge: "AI Marking",
    badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
    iconColor: "text-[#3ecf8e]",
    iconBg: "bg-[#3ecf8e]/10",
    highlights: ["Auto-marking", "Question bank", "Plagiarism detection"],
  },
];

const Features = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? features
      : features.filter((f) => f.tags.includes(activeCategory));

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3ecf8e]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-bold uppercase tracking-widest">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Everything Your School{" "}
            <span className="text-[#3ecf8e]">Needs to Thrive</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A comprehensive, all-in-one platform built for South African schools —
            from admin to analytics, teaching to communication.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#3ecf8e] text-black border-[#3ecf8e] shadow-lg shadow-[#3ecf8e]/20"
                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#3ecf8e]/50 hover:text-[#3ecf8e]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-[#3ecf8e]/40 hover:shadow-xl hover:shadow-[#3ecf8e]/5 transition-all duration-300 flex flex-col"
            >
              {/* Top badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${feature.iconBg}`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}
                >
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                {feature.desc}
              </p>

              {/* Highlights */}
              <ul className="space-y-1.5 mt-auto">
                {feature.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3ecf8e] shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
