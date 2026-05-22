import {
  Twitter,
  Facebook,
  Linkedin,
  ArrowUp,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo-school.jpeg"
                alt="Vhembe Rising Star Academy logo"
                className="size-12 rounded-md border border-red-200 bg-white object-cover"
              />
              <span className="text-xl font-black tracking-normal text-gray-950">
                Vhembe Rising Star Academy
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-500 leading-relaxed">
              A proudly South African school management system — empowering educators,
              learners, and parents from Grade R to Matric.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#dc2626] hover:text-black transition-all text-gray-500 dark:text-gray-400 shadow-sm"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#dc2626] hover:text-black transition-all text-gray-500 dark:text-gray-400 shadow-sm"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#dc2626] hover:text-black transition-all text-gray-500 dark:text-gray-400 shadow-sm"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* School Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-lg">
              For Schools
            </h4>
            <ul className="space-y-4">
              {[
                "Learner Management",
                "Teacher Profiles",
                "Timetabling",
                "SBA & Assessment",
                "Report Cards",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-500 hover:text-[#dc2626] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-lg">
              Resources
            </h4>
            <ul className="space-y-4">
              {[
                "CAPS Guidelines",
                "DBE Circulars",
                "NSC Exam Prep",
                "Parent Portal",
                "Help & Support",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-500 hover:text-[#dc2626] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-lg">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 text-[#dc2626] shrink-0" />
                <span>123 Ubuntu Street, Johannesburg, Gauteng, 2000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-500">
                <Phone className="w-4 h-4 text-[#dc2626] shrink-0" />
                <span>+27 11 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-500">
                <Mail className="w-4 h-4 text-[#dc2626] shrink-0" />
                <span>info@Vhembe Rising Star Academy.co.za</span>
              </li>
            </ul>
            <div className="mt-6 flex">
              <input
                type="email"
                placeholder="Your school email"
                className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-l-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none w-full text-sm"
              />
              <button className="bg-[#dc2626] text-black px-4 py-3 rounded-r-lg font-bold hover:bg-[#b91c1c] transition-colors text-sm">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 Vhembe Rising Star Academy. Proudly South African. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              POPIA Compliance
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms of Use
            </a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-6 md:mt-0 p-3 rounded-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 hover:border-[#dc2626] transition-all group shadow-sm"
          >
            <ArrowUp className="w-5 h-5 group-hover:text-[#dc2626] text-gray-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
