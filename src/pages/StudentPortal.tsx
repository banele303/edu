import { useAuth } from "@/hooks/AuthProvider";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Award, TrendingUp, CheckCircle, GraduationCap } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navigate } from "react-router";

export default function StudentPortal() {
  const { user } = useAuth();

  const mySubmissions = useQuery(api.submissions.getSubmissions, user ? { examId: undefined as any } : "skip");
  const myFees = useQuery(api.finance.getFees, user ? {} : "skip");
  const upcomingExams = useQuery(api.exams.getExams, user ? {} : "skip");
  const myBadges = useQuery(api.badges.getMyBadges, user ? { studentId: undefined as any } : "skip");
  const recentAnnouncements = useQuery(api.announcements.getAnnouncements);

  if (user && user.role !== "student") {
    return <Navigate to="/dashboard" />;
  }

  const loading = mySubmissions === undefined;

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const pendingAssignments = mySubmissions?.filter((s: any) => s.status === "submitted")?.length || 0;
  const gradedAssignments = mySubmissions?.filter((s: any) => s.status === "graded")?.length || 0;
  const totalFeeBalance = myFees?.reduce((sum: number, f: any) => f.status !== "paid" ? sum + f.amount : sum, 0) || 0;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
        <p className="text-muted-foreground">Track your assignments, exams, grades, and progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Awaiting grading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Graded</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradedAssignments}</div>
            <p className="text-xs text-muted-foreground">Assignments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Exams</CardTitle>
            <GraduationCap className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fee Balance</CardTitle>
            <TrendingUp className={cn("h-4 w-4", totalFeeBalance > 0 ? "text-red-500" : "text-emerald-500")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R {totalFeeBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalFeeBalance > 0 ? "Outstanding" : "All paid"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-red-500" />
                Upcoming Exams
              </CardTitle>
              <CardDescription>Your scheduled assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : upcomingExams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming exams.</p>
              ) : (
                upcomingExams.slice(0, 5).map((exam: any) => (
                  <div key={exam._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                      <FileText className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{exam.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {exam.subject?.name || "Unknown"} • {exam.duration} mins
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {format(new Date((exam.dueDate || "") + "T00:00:00"), "d MMM")}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentAnnouncements === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : recentAnnouncements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No announcements.</p>
              ) : (
                recentAnnouncements.slice(0, 3).map((ann: any) => (
                  <div key={ann._id} className="border-l-4 border-l-primary pl-3 py-2">
                    <p className="text-sm font-medium">{ann.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatDistanceToNow(new Date(ann._creationTime), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                My Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myBadges === undefined ? (
                <Skeleton className="h-16 w-full" />
              ) : myBadges.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No badges yet. Keep learning!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {myBadges.map((badge: any) => (
                    <div key={badge._id} className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full">
                      <Award className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-medium">{badge.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mySubmissions?.filter((s: any) => s.status === "graded").length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No graded assignments yet.</p>
              ) : (
                mySubmissions?.filter((s: any) => s.status === "graded").slice(0, 5).map((sub: any) => (
                  <div key={sub._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{sub.exam?.title || "Assignment"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(sub._creationTime), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge className={cn(
                      sub.score >= 70 ? "bg-emerald-500" : sub.score >= 50 ? "bg-amber-500" : "bg-red-500"
                    )}>
                      {sub.score}%
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
