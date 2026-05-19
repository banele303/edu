import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createYear = mutation({
  args: {
    name: v.string(),
    fromYear: v.string(),
    toYear: v.string(),
    isCurrent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // If this is set to current, unset others
    if (args.isCurrent) {
      const currentYears = await ctx.db
        .query("academicYears")
        .filter((q) => q.eq(q.field("isCurrent"), true))
        .collect();
      for (const year of currentYears) {
        await ctx.db.patch(year._id, { isCurrent: false });
      }
    }

    const yearId = await ctx.db.insert("academicYears", {
      name: args.name,
      fromYear: args.fromYear,
      toYear: args.toYear,
      isCurrent: args.isCurrent,
    });

    return { yearId };
  },
});

export const updateYear = mutation({
  args: {
    id: v.id("academicYears"),
    name: v.string(),
    fromYear: v.string(),
    toYear: v.string(),
    isCurrent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // If this is set to current, unset others
    if (args.isCurrent) {
      const currentYears = await ctx.db
        .query("academicYears")
        .filter((q) => q.eq(q.field("isCurrent"), true))
        .collect();
      for (const year of currentYears) {
        if (year._id !== args.id) {
          await ctx.db.patch(year._id, { isCurrent: false });
        }
      }
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      fromYear: args.fromYear,
      toYear: args.toYear,
      isCurrent: args.isCurrent,
    });
  },
});

export const deleteYear = mutation({
  args: { id: v.id("academicYears") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const getCurrentAcademicYear = query({
  args: {},
  handler: async (ctx) => {
    const year = await ctx.db
      .query("academicYears")
      .filter((q) => q.eq(q.field("isCurrent"), true))
      .first();
    return year;
  },
});

export const getAcademicYears = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("academicYears").collect();
  },
});
