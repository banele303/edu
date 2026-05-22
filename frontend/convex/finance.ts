import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFees = query({
  args: { studentId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("fees");
    if (args.studentId) {
      q = q.filter((q) => q.eq(q.field("student"), args.studentId));
    }
    return await q.collect();
  },
});

export const addFeeRecord = mutation({
  args: {
    studentId: v.id("users"),
    amount: v.number(),
    dueDate: v.string(),
    academicYear: v.id("academicYears"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fees", {
      student: args.studentId,
      amount: args.amount,
      dueDate: args.dueDate,
      status: "pending",
      academicYear: args.academicYear,
    });
  },
});

export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenses").collect();
  },
});

export const addExpense = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenses", args);
  },
});
