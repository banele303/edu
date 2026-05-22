import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAttendance = query({
  args: {
    classId: v.id("classes"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_date_class", (q) =>
        q.eq("date", args.date).eq("class", args.classId)
      )
      .collect();
  },
});

export const markAttendance = mutation({
  args: {
    classId: v.id("classes"),
    date: v.string(),
    records: v.array(
      v.object({
        studentId: v.id("users"),
        status: v.union(v.literal("present"), v.literal("absent"), v.literal("late")),
        remarks: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // In a real app, check if user is the teacher of the class
    
    for (const record of args.records) {
      const existing = await ctx.db
        .query("attendance")
        .withIndex("by_date_class", (q) =>
          q.eq("date", args.date).eq("class", args.classId)
        )
        .filter((q) => q.eq(q.field("student"), record.studentId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: record.status,
          remarks: record.remarks,
        });
      } else {
        await ctx.db.insert("attendance", {
          student: record.studentId,
          class: args.classId,
          date: args.date,
          status: record.status,
          remarks: record.remarks,
        });
      }
    }
  },
});
