import { useAuth } from "@/hooks/AuthProvider";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, FileText, Users, GraduationCap, Banknote,
  Megaphone, MessageSquare, BarChart3, BookOpen, AlertTriangle,
  Award, Sparkles, User, Upload
} from "lucide-react";
import { AiInsightWidget } from "@/components/dashboard/ai-insight-widget";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

const EVENT_COLORS: Record<string, string> = {
  exam: "bg-red-500",
  sports: "bg-green-500",
  holiday: "bg-amber-500",
  meeting: "bg-blue-500",
  other: "bg-purple-500",
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "border-l-red-500 bg-red-500/5",
  normal: "border-l-primary bg-primary/5",
  low: "border-l-muted",
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const statsDataConvex = useQuery(api.stats.getDashboardStats);
  const upcomingEvents = useQuery(api.events.getUpcomingEvents);
  const announcements = useQuery(api.announcements.getAnnouncements);
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  const loading = statsDataConvex === undefined;

  const quickLinks = [
    { label: "Timetable", icon: Calendar, path: "/timetable", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Study Buddy", icon: Sparkles, path: "/study-buddy", roles: ["admin", "teacher", "student"] },
    { label: "My Portal", icon: GraduationCap, path: "/student-portal", roles: ["student"] },
    { label: "Parent Portal", icon: Users, path: "/parent-portal", roles: ["parent"] },
    { label: "Resources", icon: BookOpen, path: "/resources", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Study Materials", icon: FileText, path: "/lms/materials", roles: ["teacher", "student"] },
    { label: "Announcements", icon: Megaphone, path: "/announcements", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Events Calendar", icon: Calendar, path: "/events", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Messages", icon: MessageSquare, path: "/messages", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Analytics", icon: BarChart3, path: "/analytics", roles: ["admin"] },
    { label: "Manage Students", icon: Users, path: "/users/students", roles: ["admin"] },
    { label: "Manage Classes", icon: BookOpen, path: "/classes", roles: ["admin", "teacher"] },
    { label: "Fee Collection", icon: Banknote, path: "/finance/fees", roles: ["admin"] },
    { label: "Badges", icon: Award, path: "/badges", roles: ["admin", "teacher"] },
    { label: "My Profile", icon: User, path: "/profile", roles: ["admin", "teacher", "student", "parent"] },
    { label: "Admin Resources", icon: Upload, path: "/admin/resources", roles: ["admin"] },
  ].filter(l => l.roles.includes(user?.role || "student"));

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-64" />
          <Skeleton className="col-span-3 h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">Here's what's happening at your school today.</p>
        </div>
        {!!unreadCount && unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => navigate("/messages")} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {unreadCount} unread
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats role={user?.role || "student"} data={statsDataConvex} />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Left column */}
        <div className="col-span-4 space-y-4">
          <AiInsightWidget role={user?.role} />

          {/* Latest Announcements */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Latest Announcements</CardTitle>
                <CardDescription>School notices for you</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/announcements")}>View all</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {announcements === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
              ) : (
                announcements.slice(0, 3).map((ann) => (
                  <div
                    key={ann._id}
                    className={cn("border-l-4 pl-3 py-2 rounded-sm", PRIORITY_STYLES[ann.priority] || "")}
                  >
                    <div className="flex items-center gap-2">
                      {ann.priority === "urgent" && <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />}
                      <p className="text-sm font-medium truncate">{ann.title}</p>
                    </div>
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

        {/* Right column */}
        <div className="col-span-3 space-y-4">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>Calendar</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
              ) : (
                upcomingEvents.map((ev) => (
                  <div key={ev._id} className="flex items-center gap-3">
                    <div className={cn("w-2 h-10 rounded-full shrink-0", EVENT_COLORS[ev.type] || "bg-primary")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(ev.date + "T00:00:00"), "EEE, d MMM yyyy")}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize shrink-0">{ev.type}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickLinks.slice(0, 6).map(({ label, icon: Icon, path }) => (
                <Button key={path} variant="outline" className="justify-start h-9 text-xs gap-2" onClick={() => navigate(path)}>
                  <Icon className="h-3.5 w-3.5" /> {label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
