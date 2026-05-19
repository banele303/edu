import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── QUERIES ──────────────────────────────────────────────────────────────────

export const getMyNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipient", userId))
      .order("desc")
      .take(50);
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_read", (q) =>
        q.eq("recipient", userId).eq("isRead", false)
      )
      .collect();
    return unread.length;
  },
});

// ── MUTATIONS ─────────────────────────────────────────────────────────────────

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_read", (q) =>
        q.eq("recipient", userId).eq("isRead", false)
      )
      .collect();
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { isRead: true })));
  },
});

// Internal helper — call this from other mutations to create notifications
export const createNotification = mutation({
  args: {
    recipientId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      recipient: args.recipientId,
      title: args.title,
      message: args.message,
      isRead: false,
      type: args.type,
      link: args.link,
    });
  },
});
