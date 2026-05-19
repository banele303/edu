import { BookOpen, Calculator, FlaskConical, Globe, Landmark, Music2, ChevronRight } from "lucide-react";

const subjects = [
  {
    title: "Mathematics & Mathematical Literacy",
    icon: Calculator,
    desc: "From Grades 1–12, supporting both Mathematics and Maths Lit learners through the CAPS framework.",
    tags: ["Pure Maths", "Maths Lit", "Grade 10–12"],
  },
  {
    title: "Natural Sciences & Life Sciences",
    icon: FlaskConical,
    desc: "Covering Physical Sciences and Life Sciences across all phases — from junior to FET.",
    tags: ["Physics", "Chemistry", "Biology"],
  },
  {
    title: "Languages",
    icon: BookOpen,
    desc: "Full support for Home Language, First Additional Language and Second Additional Language learners.",
    tags: ["Afrikaans", "isiZulu", "English", "Xhosa"],
  },
  {
    title: "Social Sciences & History",
    icon: Globe,
    desc: "History and Geography for the Intermediate and Senior Phase, aligned to the CAPS syllabus.",
    tags: ["History", "Geography", "Grade 4–9"],
  },
  {
    title: "Accounting & Business Studies",
    icon: Landmark,
    desc: "Supporting the full FET commerce stream from Grade 10 to NSC examinations.",
    tags: ["Accounting", "Business Studies", "Economics"],
  },
  {
    title: "Creative Arts & Technology",
    icon: Music2,
    desc: "Visual Arts, Music, Design and Technology subjects for holistic learner development.",
    tags: ["Visual Arts", "Music", "Design"],
  },
];

const Programs = () => {
  return (
    <section id="programs" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-[#3ecf8e] font-bold tracking-widest uppercase text-sm">
              CAPS-Aligned Subjects
            </h2>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
              Every Learning Area Covered
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            EduNexus supports all CAPS learning areas from Grade R to Grade 12 — designed
            to match the South African national curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-8 rounded-2xl hover:border-[#3ecf8e]/50 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5 transition-opacity group-hover:opacity-20 dark:group-hover:opacity-10">
                <subject.icon size={80} className="text-gray-300 dark:text-white" />
              </div>

              <div className="bg-white dark:bg-[#1c1c1c] w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-gray-100 dark:border-gray-700">
                <subject.icon className="text-[#3ecf8e] w-7 h-7" />
              </div>

              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {subject.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {subject.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {subject.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="mt-8 flex items-center text-[#3ecf8e] font-bold group-hover:translate-x-2 transition-transform">
                View Details <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
