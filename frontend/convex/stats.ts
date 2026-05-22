import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // This is a simplified stats endpoint.
    // In a real app, you would query the respective collections.
    const statsData: any = {
      recentActivity: [
        "System maintenance scheduled",
        "New semester started",
      ],
    };

    if (user.role === "admin") {
      const users = await ctx.db.query("users").collect();
      const classes = await ctx.db.query("classes").collect();
      statsData.totalStudents = users.filter((u) => u.role === "student").length;
      statsData.totalTeachers = users.filter((u) => u.role === "teacher").length;
      statsData.totalClasses = classes.length;
    } else if (user.role === "teacher") {
      const exams = await ctx.db
        .query("exams")
        .filter((q) => q.eq(q.field("teacher"), user._id))
        .collect();
      statsData.activeExams = exams.length;
    }

    return statsData;
  },
});
