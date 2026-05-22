import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("schoolSettings").first();
  },
});

export const updateSettings = mutation({
  args: {
    id: v.optional(v.id("schoolSettings")),
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    logo: v.optional(v.string()),
    motto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const { id, ...settings } = args;
    if (id) {
      await ctx.db.patch(id, settings);
    } else {
      await ctx.db.insert("schoolSettings", settings);
    }
  },
});
