import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ClipboardList, Users, Award, BookOpenCheck } from "lucide-react";

const data = [
  { year: "2019", learners: 120 },
  { year: "2020", learners: 210 },
  { year: "2021", learners: 380 },
  { year: "2022", learners: 520 },
  { year: "2023", learners: 750 },
  { year: "2024", learners: 1100 },
];

const Stats = () => {
  return (
    <section id="stats" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#dc2626] font-bold tracking-widest uppercase text-sm">
            Our Impact
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Empowering South African Schools
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From rural schools in Limpopo to urban classrooms in Gauteng — Vhembe Rising Star Academy is
            helping educators deliver better outcomes for every learner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1c1c1c] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Learner Enrolment Growth
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    className="dark:stroke-[#2a2a2a]"
                  />
                  <XAxis dataKey="year" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tw-bg-opacity, white)",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#dc2626" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="learners"
                    stroke="#dc2626"
                    fillOpacity={1}
                    fill="url(#colorGrad)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: Users,
                title: "Learner & Staff Profiles",
                desc: "Manage all learner, teacher, and parent records in one place.",
                color: "text-blue-500",
              },
              {
                icon: ClipboardList,
                title: "Digital Timetabling",
                desc: "Generate CAPS-aligned timetables for any school structure.",
                color: "text-purple-500",
              },
              {
                icon: BookOpenCheck,
                title: "Online Assessments",
                desc: "Create, assign, and auto-mark tests aligned to CAPS Learning Areas.",
                color: "text-[#dc2626]",
              },
              {
                icon: Award,
                title: "NSC & SBA Tracking",
                desc: "Track School-Based Assessment marks and progression reports.",
                color: "text-yellow-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-start space-x-4 hover:border-[#dc2626]/30 transition-all cursor-default shadow-sm hover:shadow-md"
              >
                <div
                  className={`p-3 rounded-lg bg-gray-50 dark:bg-[#121212] ${item.color}`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-gray-900 dark:text-white font-bold">
                    {item.title}
                  </h5>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
