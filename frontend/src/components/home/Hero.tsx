import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#dc2626] opacity-5 dark:opacity-5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#dc2626] opacity-10 dark:opacity-10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-[#dc2626]/10 border border-[#dc2626]/20 px-3 py-1 rounded-full text-[#dc2626] text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
              </span>
              <span>2025 Enrolments now open — Term 3</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-950 leading-tight">
              Vhembe Rising Star Academy
            </h1>

            <p className="text-xl text-gray-700 max-w-xl">
              A bold, learner-first academy experience for families, teachers, and
              students. Built around a clean white, red, and black identity that feels
              sharp, confident, and proudly local.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#dc2626] text-black px-8 py-4 rounded-lg font-bold hover:bg-[#b91c1c] transition-all transform hover:translate-y-[-2px] shadow-lg shadow-[#dc2626]/20"
              >
                <span>Enrol Your School</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#dc2626] px-8 py-4 rounded-lg font-bold transition-all">
                <Play className="w-4 h-4 text-[#dc2626] fill-[#dc2626]" />
                <span>Watch a Demo</span>
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vhembe
                </p>
                <p className="text-sm text-gray-500">Rising Together</p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  CAPS
                </p>
                <p className="text-sm text-gray-500">Aligned Curriculum</p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  DBE
                </p>
                <p className="text-sm text-gray-500">Compliant Reports</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl group">
              <img
                src="/hero_learners.png"
                alt="South African school learners"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 dark:from-[#121212] via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-[#dc2626] mb-1 uppercase tracking-wider">
                  Term 3 Highlight
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  NSC Mock Exam Results Now Live
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your Grade 12 learners' mock performance in real-time.
                </p>
              </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-[#1c1c1c] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center">
                  <ChevronRight className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">New Feature</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Digital Report Cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
