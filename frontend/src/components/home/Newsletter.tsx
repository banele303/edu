import { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Bell, BookOpen } from "lucide-react";

const perks = [
  { icon: Bell, text: "Weekly curriculum & DBE updates" },
  { icon: BookOpen, text: "CAPS teaching resources & tips" },
  { icon: Sparkles, text: "New Vhembe Rising Star Academy feature releases" },
];

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="newsletter" className="py-28 relative overflow-hidden">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b1e] via-[#0a1a14] to-[#0d2b1e] dark:from-[#051510] dark:via-[#030d09] dark:to-[#051510]" />
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#dc2626]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#dc2626]/5 blur-[160px] rounded-full pointer-events-none" />
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #dc2626 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#dc2626]" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <p className="text-[#dc2626] text-xs font-bold uppercase tracking-widest mb-3">
              Stay Informed
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              The South African{" "}
              <span className="text-[#dc2626]">Education Digest</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Join 8 000+ educators and school leaders who receive our weekly
              newsletter packed with curriculum news, teaching tips, and platform updates.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            {perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="w-7 h-7 rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center shrink-0">
                  <perk.icon className="w-3.5 h-3.5 text-[#dc2626]" />
                </div>
                {perk.text}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="mt-8 max-w-lg mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your school email address"
                  required
                  className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626]/60 focus:bg-white/10 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="bg-[#dc2626] text-black px-7 py-4 rounded-xl font-bold text-sm hover:bg-[#b91c1c] transition-all hover:scale-105 shadow-xl shadow-[#dc2626]/20 shrink-0"
                >
                  Subscribe Free
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 animate-pulse-once">
                <div className="w-14 h-14 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#dc2626]" />
                </div>
                <p className="text-white font-bold text-lg">You're subscribed! 🎉</p>
                <p className="text-gray-400 text-sm">
                  Check your inbox for a confirmation email.
                </p>
              </div>
            )}
            <p className="text-gray-600 text-xs mt-3">
              No spam. Unsubscribe anytime. POPIA compliant — your data stays safe.
            </p>
          </div>

          {/* Social proof chips */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {["8 000+ subscribers", "Weekly edition", "Free forever"].map((item, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
