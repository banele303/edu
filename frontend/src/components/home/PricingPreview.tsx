import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const plans = [
  {
    name: "Starter",
    price: "R 499",
    period: "/ month",
    tagline: "Perfect for small primary schools",
    color: "border-gray-200 dark:border-gray-800",
    badge: null,
    features: [
      "Up to 200 learners",
      "5 staff accounts",
      "Timetabling",
      "Digital report cards",
      "Parent portal",
      "Email support",
    ],
    cta: "Get Started",
    ctaStyle:
      "border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-[#3ecf8e] hover:text-[#3ecf8e]",
    popular: false,
  },
  {
    name: "Professional",
    price: "R 1 299",
    period: "/ month",
    tagline: "For growing primary & high schools",
    color: "border-[#3ecf8e]",
    badge: "Most Popular",
    features: [
      "Up to 1 000 learners",
      "Unlimited staff accounts",
      "Everything in Starter",
      "AI Study Buddy",
      "Grade Insights Analytics",
      "SBA & NSC tracking",
      "SMS & push notifications",
      "Priority support",
    ],
    cta: "Start Free Trial",
    ctaStyle:
      "bg-[#3ecf8e] text-black hover:bg-[#34b27b] shadow-lg shadow-[#3ecf8e]/25",
    popular: true,
  },
  {
    name: "District",
    price: "Custom",
    period: "",
    tagline: "For circuits, districts & DoE",
    color: "border-gray-200 dark:border-gray-800",
    badge: null,
    features: [
      "Unlimited learners",
      "Multi-school dashboard",
      "Everything in Professional",
      "District-wide analytics",
      "Custom DBE reporting",
      "Dedicated account manager",
      "SLA & data governance",
      "On-site training",
    ],
    cta: "Contact Us",
    ctaStyle:
      "border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-[#3ecf8e] hover:text-[#3ecf8e]",
    popular: false,
  },
];

const PricingPreview = () => {
  return (
    <section id="pricing-preview" className="py-28 relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3ecf8e]/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-bold uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Simple, Transparent{" "}
            <span className="text-[#3ecf8e]">Pricing</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
            No hidden fees. No lock-in contracts. Cancel anytime. All plans
            include free onboarding support.
          </p>

          {/* Toggle placeholder (visual only) */}
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl mt-4">
            <button className="px-5 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white font-semibold text-sm shadow-sm">
              Monthly
            </button>
            <button className="px-5 py-2 rounded-lg text-gray-500 dark:text-gray-400 font-semibold text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
              Annual{" "}
              <span className="text-[#3ecf8e] text-xs font-bold ml-1">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col bg-white dark:bg-[#1a1a1a] border-2 ${plan.color} rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "shadow-2xl shadow-[#3ecf8e]/10 scale-[1.02]"
                  : "hover:border-[#3ecf8e]/40 hover:shadow-xl"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#3ecf8e] text-black text-xs font-black px-5 py-1.5 rounded-full shadow-lg shadow-[#3ecf8e]/30 uppercase tracking-wider">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#3ecf8e] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.name === "District" ? "/contact" : "/login"}
                className={`w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${plan.ctaStyle}`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-600 mt-10">
          All plans include a{" "}
          <span className="text-[#3ecf8e] font-semibold">30-day free trial</span>{" "}
          — no credit card required.{" "}
          <Link to="/pricing" className="text-[#3ecf8e] hover:underline font-semibold">
            See full feature comparison →
          </Link>
        </p>
      </div>
    </section>
  );
};

export default PricingPreview;
