import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Get all conversations for the current user (unique contacts)
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const sent = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("sender"), userId))
      .collect();

    const received = await ctx.db
      .query("messages")
      .withIndex("by_recipient_read", (q) => q.eq("recipient", userId))
      .collect();

    const contactIds = new Set<string>();
    [...sent, ...received].forEach((m) => {
      const other = m.sender === userId ? m.recipient : m.sender;
      contactIds.add(other);
    });

    return await Promise.all(
      Array.from(contactIds).map(async (contactId) => {
        const contact = await ctx.db.get(contactId as Id<"users">);
        const convId = [userId, contactId].sort().join("_");
        const lastMsg = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", convId))
          .order("desc")
          .first();
        const unread = await ctx.db
          .query("messages")
          .withIndex("by_recipient_read", (q) =>
            q.eq("recipient", userId).eq("isRead", false)
          )
          .filter((q) => q.eq(q.field("sender"), contactId as any))
          .collect();
        return { contact, lastMsg, unreadCount: unread.length };
      })
    );
  },
});

export const getConversationMessages = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const convId = [userId, args.otherUserId].sort().join("_");
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", convId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    recipientId: v.id("users"),
    content: v.string(),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const convId = [userId, args.recipientId].sort().join("_");

    const msgId = await ctx.db.insert("messages", {
      sender: userId,
      recipient: args.recipientId,
      content: args.content,
      subject: args.subject,
      isRead: false,
      conversationId: convId,
    });

    // Notify recipient
    const sender = await ctx.db.get(userId);
    await ctx.db.insert("notifications", {
      recipient: args.recipientId,
      title: `New message from ${sender?.name || "Someone"}`,
      message: args.content.substring(0, 80) + (args.content.length > 80 ? "..." : ""),
      isRead: false,
      type: "message",
      link: `/messages`,
    });

    return msgId;
  },
});

export const markConversationRead = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const unread = await ctx.db
      .query("messages")
      .withIndex("by_recipient_read", (q) =>
        q.eq("recipient", userId).eq("isRead", false)
      )
      .filter((q) => q.eq(q.field("sender"), args.otherUserId))
      .collect();
    await Promise.all(unread.map((m) => ctx.db.patch(m._id, { isRead: true })));
  },
});

// Get users you can message (teachers for parents, parents/students for teachers, everyone for admin)
export const getMessageableUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    const role = user?.role;

    let targetRoles: string[] = [];
    if (role === "admin") targetRoles = ["teacher", "student", "parent"];
    else if (role === "teacher") targetRoles = ["parent", "student", "admin"];
    else if (role === "parent") targetRoles = ["teacher", "admin"];
    else targetRoles = ["teacher", "admin"];

    const all = await ctx.db.query("users").collect();
    return all.filter(
      (u) => u._id !== userId && u.role && targetRoles.includes(u.role)
    );
  },
});
