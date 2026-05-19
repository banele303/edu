import { ArrowRight, Clock, User, Tag } from "lucide-react";
import { Link } from "react-router";

const posts = [
  {
    slug: "caps-alignment-2025",
    category: "Curriculum",
    categoryColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
    title: "What CAPS 2025 Changes Mean for Your School",
    excerpt:
      "The DBE released updated CAPS guidelines for 2025. We break down the key curriculum shifts and how EduNexus automatically adapts your assessment schedules and timetables.",
    image: "/blog_caps_2025.png",
    author: "EduNexus Editorial",
    authorAvatar: "https://i.pravatar.cc/40?img=10",
    date: "15 May 2025",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "ai-tutoring-matric",
    category: "AI & Learning",
    categoryColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    title: "How AI Tutoring is Helping Grade 12 Learners Ace Matric",
    excerpt:
      "Schools using EduNexus's AI Study Buddy saw an average 22% improvement in NSC trial exam scores. Here's the data — and the method behind the results.",
    image: "/blog_ai_tutoring.png",
    author: "Dr. Amahle Zulu",
    authorAvatar: "https://i.pravatar.cc/40?img=45",
    date: "10 May 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "popia-school-compliance",
    category: "Compliance",
    categoryColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    title: "POPIA & School Data: What Every Principal Must Know",
    excerpt:
      "With POPIA enforcement now fully active, schools face real liability for data misuse. We outline the key obligations and how EduNexus keeps you compliant automatically.",
    image: "/blog_popia_compliance.png",
    author: "Legal Desk",
    authorAvatar: "https://i.pravatar.cc/40?img=15",
    date: "5 May 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "timetable-productivity",
    category: "Administration",
    categoryColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    title: "Smart Timetabling: Saving Schools 40 Hours Per Term",
    excerpt:
      "Manual timetabling is one of the most time-consuming tasks in school admin. Discover how our AI-driven timetabling engine eliminates conflicts and cuts planning time dramatically.",
    image: "/blog_smart_timetabling.png",
    author: "Product Team",
    authorAvatar: "https://i.pravatar.cc/40?img=33",
    date: "28 Apr 2025",
    readTime: "4 min read",
    featured: false,
  },
];

const Blog = () => {
  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-28 bg-gray-50 dark:bg-[#0f0f0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-bold uppercase tracking-widest">
              Latest from EduNexus
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Insights &{" "}
              <span className="text-[#3ecf8e]">Education News</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#3ecf8e] font-bold hover:underline text-sm shrink-0"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured + grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Featured post (large) */}
          <div className="lg:col-span-3 group cursor-pointer">
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-6">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span
                className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border ${featured.categoryColor} backdrop-blur-md`}
              >
                {featured.category}
              </span>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
                  {featured.title}
                </h3>
                <p className="text-gray-200 text-sm line-clamp-2">{featured.excerpt}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <img
                  src={featured.authorAvatar}
                  alt={featured.author}
                  className="w-7 h-7 rounded-full"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">{featured.author}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featured.readTime}
              </span>
              <span>{featured.date}</span>
            </div>
          </div>

          {/* Side posts */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {rest.map((post, idx) => (
              <div
                key={idx}
                className="group flex gap-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-[#3ecf8e]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${post.categoryColor}`}
                    >
                      {post.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-2 leading-snug line-clamp-2 group-hover:text-[#3ecf8e] transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Newsletter mini-card */}
            <div className="bg-gradient-to-br from-[#3ecf8e]/10 to-[#3ecf8e]/5 border border-[#3ecf8e]/20 rounded-2xl p-6">
              <Tag className="w-6 h-6 text-[#3ecf8e] mb-3" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                Education Digest
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Get weekly curriculum updates, EdTech tips and EduNexus news delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#3ecf8e] min-w-0"
                />
                <button className="bg-[#3ecf8e] text-black px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#34b27b] transition-colors shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
