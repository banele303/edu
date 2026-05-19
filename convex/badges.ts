import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyBadges = query({
  args: { studentId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const targetId = args.studentId || userId;
    return await ctx.db
      .query("badges")
      .withIndex("by_student", (q) => q.eq("student", targetId))
      .order("desc")
      .collect();
  },
});

export const awardBadge = mutation({
  args: {
    studentId: v.id("users"),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin" && user?.role !== "teacher") throw new Error("Unauthorized");

    // Check if badge already exists to avoid duplicates
    const existing = await ctx.db
      .query("badges")
      .withIndex("by_student", (q) => q.eq("student", args.studentId))
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();
    if (existing) return existing._id;

    const badgeId = await ctx.db.insert("badges", {
      student: args.studentId,
      title: args.title,
      description: args.description,
      icon: args.icon,
      category: args.category,
      awardedAt: Date.now(),
    });

    // Fire a notification to the student
    await ctx.db.insert("notifications", {
      recipient: args.studentId,
      title: "🏆 New Badge Earned!",
      message: `You earned the "${args.title}" badge. ${args.description}`,
      isRead: false,
      type: "badge",
      link: "/profile/badges",
    });

    return badgeId;
  },
});

// Auto-award attendance badge (called after marking attendance)
export const checkAndAwardAttendanceBadge = mutation({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    // Count present records this month
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("student", args.studentId))
      .filter((q) => q.gte(q.field("date"), monthStr + "-01"))
      .collect();

    const presentCount = records.filter((r) => r.status === "present").length;

    if (presentCount >= 20) {
      await ctx.db.insert("badges", {
        student: args.studentId,
        title: "Perfect Attendance",
        description: "Present every school day this month!",
        icon: "🌟",
        category: "attendance",
        awardedAt: Date.now(),
      });
    }
  },
});
