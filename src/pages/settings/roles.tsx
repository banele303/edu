import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCog, GraduationCap, Users } from "lucide-react";

const roles = [
  {
    name: "Admin",
    icon: Shield,
    description: "Full access to all system features, finance, and settings.",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    permissions: ["Full System Access", "Financial Management", "User Management", "System Configuration"],
  },
  {
    name: "Teacher",
    icon: UserCog,
    description: "Access to academic management, exams, and attendance.",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    permissions: ["Manage Classes", "Mark Attendance", "Create Exams", "View Student Profiles"],
  },
  {
    name: "Student",
    icon: GraduationCap,
    description: "Access to learning materials, timetables, and exam submissions.",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    permissions: ["View Timetable", "Take Exams", "Access Study Materials", "View Own Grades"],
  },
  {
    name: "Parent",
    icon: Users,
    description: "Access to view child's progress, attendance, and fee status.",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    permissions: ["View Child Progress", "View Attendance", "View Fee Status", "School Notifications"],
  },
];

export default function RolesPermissions() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">Overview of system roles and their respective access levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className={`p-2 rounded-lg ${role.color}`}>
                <role.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Core Permissions:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="font-normal">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
