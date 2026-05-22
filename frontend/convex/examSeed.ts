import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Seed built-in exam templates — run once
export const seedExamTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can seed templates");
    }

    const templates = [
      {
        name: "Quick Quiz",
        description: "5 MCQ questions for quick practice. Great for any subject.",
        icon: "Zap",
        examType: "quiz" as const,
        defaultDuration: 5,
        defaultQuestionCount: 5,
        questionTypeMix: [{ type: "MCQ", count: 5, points: 1 }],
        defaultDifficulty: "Easy",
        recommendedFor: ["maths", "science", "language", "humanities", "life_skills", "arts", "technology", "other"],
        isSystem: true,
      },
      {
        name: "Topic Test",
        description: "10 questions mixing MCQ and short answer on a single topic.",
        icon: "FileText",
        examType: "exam" as const,
        defaultDuration: 20,
        defaultQuestionCount: 10,
        questionTypeMix: [
          { type: "MCQ", count: 6, points: 1 },
          { type: "SHORT_ANSWER", count: 4, points: 3 },
        ],
        defaultDifficulty: "Medium",
        recommendedFor: ["language", "humanities", "life_skills", "arts", "other"],
        isSystem: true,
      },
      {
        name: "Maths Drill",
        description: "15 calculation and fill-in-the-blank problems. No essays.",
        icon: "Calculator",
        examType: "quiz" as const,
        defaultDuration: 20,
        defaultQuestionCount: 15,
        questionTypeMix: [
          { type: "MCQ", count: 5, points: 1 },
          { type: "CALCULATION", count: 7, points: 2 },
          { type: "FILL_BLANK", count: 3, points: 1 },
        ],
        defaultDifficulty: "Medium",
        recommendedFor: ["maths"],
        isSystem: true,
      },
      {
        name: "Science Lab Test",
        description: "Mix of MCQ, diagram labeling, and calculation questions.",
        icon: "FlaskConical",
        examType: "exam" as const,
        defaultDuration: 30,
        defaultQuestionCount: 12,
        questionTypeMix: [
          { type: "MCQ", count: 5, points: 1 },
          { type: "CALCULATION", count: 3, points: 3 },
          { type: "DIAGRAM_LABEL", count: 2, points: 3 },
          { type: "TRUE_FALSE", count: 2, points: 1 },
        ],
        defaultDifficulty: "Medium",
        recommendedFor: ["science"],
        isSystem: true,
      },
      {
        name: "Comprehension Test",
        description: "Reading comprehension with MCQ and short answer questions.",
        icon: "BookOpen",
        examType: "exam" as const,
        defaultDuration: 30,
        defaultQuestionCount: 8,
        questionTypeMix: [
          { type: "MCQ", count: 4, points: 1 },
          { type: "SHORT_ANSWER", count: 3, points: 3 },
          { type: "ESSAY", count: 1, points: 10 },
        ],
        defaultDifficulty: "Medium",
        recommendedFor: ["language"],
        isSystem: true,
      },
      {
        name: "Term Exam",
        description: "Full exam covering multiple topics. MCQ + short answer + essay.",
        icon: "GraduationCap",
        examType: "exam" as const,
        defaultDuration: 60,
        defaultQuestionCount: 20,
        questionTypeMix: [
          { type: "MCQ", count: 10, points: 1 },
          { type: "SHORT_ANSWER", count: 6, points: 3 },
          { type: "ESSAY", count: 2, points: 10 },
        ],
        defaultDifficulty: "Medium",
        recommendedFor: ["language", "humanities", "life_skills", "arts", "other"],
        isSystem: true,
      },
      {
        name: "True/False Challenge",
        description: "10 true/false questions for quick knowledge check.",
        icon: "ToggleLeft",
        examType: "quiz" as const,
        defaultDuration: 5,
        defaultQuestionCount: 10,
        questionTypeMix: [{ type: "TRUE_FALSE", count: 10, points: 1 }],
        defaultDifficulty: "Easy",
        recommendedFor: ["maths", "science", "language", "humanities", "life_skills", "arts", "technology", "other"],
        isSystem: true,
      },
      {
        name: "Matching Pairs",
        description: "Match terms to definitions or concepts.",
        icon: "Link",
        examType: "quiz" as const,
        defaultDuration: 10,
        defaultQuestionCount: 5,
        questionTypeMix: [{ type: "MATCH_COLUMN", count: 5, points: 2 }],
        defaultDifficulty: "Easy",
        recommendedFor: ["science", "language", "humanities", "technology"],
        isSystem: true,
      },
    ];

    const results = [];
    for (const t of templates) {
      const id = await ctx.db.insert("examTemplates", t);
      results.push(id);
    }

    return { seeded: results.length };
  },
});
