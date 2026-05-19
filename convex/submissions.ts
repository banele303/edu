import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitExam = mutation({
  args: {
    examId: v.id("exams"),
    answers: v.array(
      v.object({
        questionId: v.string(), // We will use questionText as the ID for simplicity
        answer: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "student") {
      throw new Error("Unauthorized");
    }

    // Check if already submitted
    const existing = await ctx.db
      .query("submissions")
      .filter((q) =>
        q.and(
          q.eq(q.field("exam"), args.examId),
          q.eq(q.field("student"), user._id)
        )
      )
      .unique();
    if (existing) {
      throw new Error("Exam already submitted");
    }

    // Fetch exam to calculate score
    const exam = await ctx.db.get(args.examId);
    if (!exam) throw new Error("Exam not found");

    let score = 0;
    exam.questions.forEach((q: any) => {
      const ans = args.answers.find((a) => a.questionId === q.questionText);
      if (ans && ans.answer === q.correctAnswer) {
        score += q.points;
      }
    });

    const submissionId = await ctx.db.insert("submissions", {
      exam: args.examId,
      student: user._id,
      answers: args.answers,
      score,
    });

    return { submissionId, score };
  },
});

export const getSubmissions = query({
  args: { examId: v.optional(v.id("exams")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    let submissionsQuery = ctx.db.query("submissions");
    if (args.examId) {
      submissionsQuery = submissionsQuery.filter((q) => q.eq(q.field("exam"), args.examId));
    }

    return await submissionsQuery.collect();
  },
});
