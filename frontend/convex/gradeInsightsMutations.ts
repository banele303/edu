import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Called internally by gradeInsights.ts
export const saveInsights = mutation({
  args: {
    examId: v.id("exams"),
    teacherId: v.id("users"),
    summary: v.string(),
    weakAreas: v.array(v.string()),
    strongAreas: v.array(v.string()),
    recommendedActions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Remove old insights for this exam if exists
    const existing = await ctx.db
      .query("gradeInsights")
      .withIndex("by_exam", (q) => q.eq("exam", args.examId))
      .first();
    if (existing) await ctx.db.delete(existing._id);

    return await ctx.db.insert("gradeInsights", {
      exam: args.examId,
      teacher: args.teacherId,
      summary: args.summary,
      weakAreas: args.weakAreas,
      strongAreas: args.strongAreas,
      recommendedActions: args.recommendedActions,
      generatedAt: Date.now(),
    });
  },
});
