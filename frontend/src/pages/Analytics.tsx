import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, GraduationCap, BookOpen, Banknote, TrendingUp, TrendingDown, BarChart3, CheckSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

function StatCard({ title, value, icon: Icon, sub, trend }: {
  title: string; value: string | number; icon: any; sub?: string; trend?: "up" | "down";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const stats = useQuery(api.users.getAnalyticsStats);

  if (stats === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const feeData = [
    { name: "Collected", value: stats.paidFees, fill: "#10b981" },
    { name: "Outstanding", value: stats.pendingFees, fill: "#f59e0b" },
  ];

  const peopleData = [
    { name: "Students", value: stats.totalStudents },
    { name: "Teachers", value: stats.totalTeachers },
    { name: "Parents", value: stats.totalParents },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">School-wide performance and operational insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} sub="Enrolled this year" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={Users} sub="Active staff" />
        <StatCard title="Total Classes" value={stats.totalClasses} icon={BookOpen} sub="Across all grades" />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon={CheckSquare}
          sub={stats.attendanceRate >= 85 ? "Good standing" : "Needs attention"}
          trend={stats.attendanceRate >= 85 ? "up" : "down"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Avg. Exam Score" value={stats.avgExamScore} icon={BarChart3} sub="Points per submission" />
        <StatCard title="Fees Collected" value={`R ${stats.paidFees.toLocaleString()}`} icon={Banknote} trend="up" sub="This academic year" />
        <StatCard title="Fees Outstanding" value={`R ${stats.pendingFees.toLocaleString()}`} icon={Banknote} trend="down" sub="Pending collection" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fee Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.paidFees === 0 && stats.pendingFees === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No fee data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={feeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {feeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `R ${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">People Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={peopleData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                  {peopleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
