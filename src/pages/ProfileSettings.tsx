import { useState } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, Bell, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const updateProfile = useMutation(api.users.updateMyProfile);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-500",
    teacher: "bg-blue-500/10 text-blue-500",
    student: "bg-emerald-500/10 text-emerald-500",
    parent: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="flex-1 space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#3ecf8e]" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#3ecf8e]/10 text-[#3ecf8e] text-2xl font-bold">
                {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={roleColors[user.role || "student"] || ""}>
                  {user.role}
                </Badge>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Email</Label>
              <Input value={user.email || ""} disabled className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 XX XXX XXXX"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Role</Label>
              <Input value={user.role || ""} disabled className="bg-muted capitalize" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Bio</Label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3ecf8e]/50 resize-none"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-[#3ecf8e] text-black hover:bg-[#34b27b]">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#3ecf8e]" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what notifications you'd like to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Exam reminders", desc: "Get notified before upcoming exams", default: true },
            { label: "Assignment deadlines", desc: "Reminders for due assignments", default: true },
            { label: "Announcements", desc: "School-wide announcements", default: true },
            { label: "Fee reminders", desc: "Payment due notifications", default: false },
            { label: "Messages", desc: "New message notifications", default: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={item.default}
                className="w-4 h-4 rounded border-gray-300 text-[#3ecf8e] focus:ring-[#3ecf8e]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#3ecf8e]" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed: never</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
