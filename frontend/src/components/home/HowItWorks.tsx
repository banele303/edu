import { ClipboardCheck, Settings2, Users2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Register Your School",
    desc: "Submit your school details and DBE registration number. Our team verifies and onboards your institution within 24 hours — no paperwork needed.",
    color: "text-[#dc2626]",
    bg: "bg-[#dc2626]/10",
    border: "border-[#dc2626]/30",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configure & Customise",
    desc: "Set up your phases, grades, subjects, and staff roles. Import existing learner data via CSV or connect to your current SIS system.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    number: "03",
    icon: Users2,
    title: "Invite Staff & Parents",
    desc: "Send role-based invitations to teachers, HODs, and admin. Parents receive secure portal access to track their learner's progress in real time.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Go Live & Grow",
    desc: "Begin teaching, marking, and reporting from day one. Our dedicated SA-based support team is available to help your school every step of the way.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 bg-gray-50 dark:bg-[#0f0f0f] relative overflow-hidden">
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] text-xs font-bold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Up & Running in{" "}
            <span className="text-[#dc2626]">4 Simple Steps</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
            From onboarding to fully operational — Vhembe Rising Star Academy gets your school
            digitised quickly and confidently.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#dc2626]/30 to-transparent z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Icon bubble */}
                <div
                  className={`relative w-28 h-28 rounded-3xl ${step.bg} border-2 ${step.border} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                  {/* Step number badge */}
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-xs font-black text-gray-900 dark:text-white flex items-center justify-center shadow-md">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-20 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#dc2626] mb-1">
              No setup fees
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ready to get started today?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Join over 150 South African schools already on the platform.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="/login"
              className="bg-[#dc2626] text-black px-7 py-3 rounded-xl font-bold hover:bg-[#b91c1c] transition-all hover:scale-105 shadow-lg shadow-[#dc2626]/20"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-7 py-3 rounded-xl font-bold hover:border-[#dc2626] hover:text-[#dc2626] transition-all"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
