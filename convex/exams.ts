declare const process: { env: Record<string, string | undefined> };
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { api } from "./_generated/api";

export const getExams = query({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    let examsQuery = ctx.db.query("exams");
    if (args.classId) {
      examsQuery = examsQuery.filter((q) => q.eq(q.field("class"), args.classId));
    }

    const exams = await examsQuery.collect();
    return await Promise.all(
      exams.map(async (exam) => {
        const subject = await ctx.db.get(exam.subject);
        const classObj = await ctx.db.get(exam.class);
        const teacher = await ctx.db.get(exam.teacher);

        return {
          ...exam,
          subject,
          class: classObj,
          teacher,
        };
      })
    );
  },
});

export const getExam = query({
  args: { id: v.id("exams") },
  handler: async (ctx, args) => {
    const exam = await ctx.db.get(args.id);
    if (!exam) return null;

    const subject = await ctx.db.get(exam.subject);
    const classObj = await ctx.db.get(exam.class);
    const teacher = await ctx.db.get(exam.teacher);

    return {
      ...exam,
      subject,
      class: classObj,
      teacher,
    };
  },
});

export const createExam = mutation({
  args: {
    title: v.string(),
    subject: v.id("subjects"),
    class: v.id("classes"),
    duration: v.number(),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    const examId = await ctx.db.insert("exams", {
      title: args.title,
      subject: args.subject,
      class: args.class,
      teacher: user._id,
      duration: args.duration,
      dueDate: args.dueDate,
      isActive: false, // Inactive until questions are generated/reviewed
      questions: [],
    });

    return { examId };
  },
});

export const updateExamQuestions = mutation({
  args: {
    examId: v.id("exams"),
    questions: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.examId, { questions: args.questions });
  },
});

export const generateExam = action({
  args: {
    subjectId: v.id("subjects"),
    classId: v.id("classes"),
    topic: v.string(),
    difficulty: v.string(),
    count: v.number(),
    title: v.string(),
    questionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Get Subject Name for prompt
    const subjects: any = await ctx.runQuery(api.subjects.getSubjects);
    const subject = subjects.find((s: any) => s._id === args.subjectId);
    const subjectName = subject?.name || "General";

    // 2. Create the Exam record first
    // Using string path to avoid circularity error in TypeScript
    const { examId }: any = await ctx.runMutation("exams:createExam" as any, {
      title: args.title,
      subject: args.subjectId,
      class: args.classId,
      duration: 60, // Default 60 mins
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days from now
    });

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return { questions: [] };

    const qType = args.questionType || "MCQ";
    let prompt = "";

    if (qType === "MCQ") {
      prompt = `
        You are an expert South African teacher creating a multiple-choice exam.
        
        CONTEXT:
        - Subject: ${subjectName}
        - Topic: ${args.topic}
        - Difficulty/Grade Level: ${args.difficulty}
        - Total Questions: ${args.count}

        STRICT JSON SCHEMA (Array of Objects):
        [
          {
            "questionText": "Question string",
            "type": "MCQ",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "The exact string of the correct option",
            "points": 1
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No conversational text or markdown.
        2. Ensure correct answer matches one of the options exactly.
        3. Tailor questions to the specified difficulty/grade level.
      `;
    } else if (qType === "SHORT_ANSWER") {
      prompt = `
        You are an expert South African teacher creating a written short-answer and essay-style exam.
        
        CONTEXT:
        - Subject: ${subjectName}
        - Topic: ${args.topic}
        - Difficulty/Grade Level: ${args.difficulty}
        - Total Questions: ${args.count}

        STRICT JSON SCHEMA (Array of Objects):
        [
          {
            "questionText": "Question string",
            "type": "SHORT_ANSWER",
            "options": [],
            "correctAnswer": "Detailed model answer / grading guidelines key explaining what is expected for full marks.",
            "points": 5
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No conversational text or markdown.
        2. Options must be an empty array [].
        3. Formulate deep conceptual, theory, explanation, or essay questions.
        4. Assign marks/points (e.g. 3 to 10 points) depending on the complexity of the written response.
      `;
    } else {
      prompt = `
        You are an expert South African teacher creating a formal, high-quality balanced test containing a mix of multiple-choice and written open-ended questions.
        
        CONTEXT:
        - Subject: ${subjectName}
        - Topic: ${args.topic}
        - Difficulty/Grade Level: ${args.difficulty}
        - Total Questions: ${args.count}

        STRICT JSON SCHEMA (Array of Objects):
        An array where each question object can be either "MCQ" or "SHORT_ANSWER".
        
        Example format:
        [
          {
            "questionText": "Multiple choice question string?",
            "type": "MCQ",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "The exact correct option string",
            "points": 1
          },
          {
            "questionText": "Written theory / short answer question?",
            "type": "SHORT_ANSWER",
            "options": [],
            "correctAnswer": "Detailed model answer / grading guide.",
            "points": 5
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No conversational text or markdown.
        2. Mix MCQ and SHORT_ANSWER questions to test both factual retrieval and deep conceptual explanation.
        3. MCQ questions MUST have 4 options and matching correctAnswer. SHORT_ANSWER must have empty options [].
      `;
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const { text } = await generateText({
      prompt,
      model: google("gemini-2.5-flash"),
    });

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanJson);

    await ctx.runMutation("exams:updateExamQuestions" as any, {
      examId,
      questions,
    });

    return { success: true, examId };
  },
});
export const generateExamFromMaterial = action({
  args: {
    examId: v.id("exams"),
    materialId: v.id("materials"),
    difficulty: v.string(),
    count: v.number(),
    questionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return { questions: [] };

    const materials = await ctx.runQuery(api.lms.getMaterials, {});
    const targetMaterial = materials.find((m: any) => m._id === args.materialId);
    if (!targetMaterial || !targetMaterial.extractedText) {
      throw new Error("Material or extracted text not found.");
    }

    const qType = args.questionType || "MCQ";
    let prompt = "";

    if (qType === "MCQ") {
      prompt = `
        You are an expert South African teacher. Create a JSON array of ${args.count} multiple-choice questions based ONLY on the provided study material.
        
        STUDY MATERIAL:
        ${targetMaterial.extractedText.slice(0, 4000)}

        DIFFICULTY/GRADE LEVEL: ${args.difficulty}
        
        STRICT JSON SCHEMA (Array of Objects):
        [
          {
            "questionText": "Question string",
            "type": "MCQ",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "The exact string of the correct option",
            "points": 1
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No Markdown.
        2. Ensure correct answer matches one of the options exactly.
        3. Questions must be derived directly from the study material provided above.
      `;
    } else if (qType === "SHORT_ANSWER") {
      prompt = `
        You are an expert South African teacher. Create a JSON array of ${args.count} written short-answer and essay-style questions based ONLY on the provided study material.
        
        STUDY MATERIAL:
        ${targetMaterial.extractedText.slice(0, 4000)}

        DIFFICULTY/GRADE LEVEL: ${args.difficulty}
        
        STRICT JSON SCHEMA (Array of Objects):
        [
          {
            "questionText": "Question string",
            "type": "SHORT_ANSWER",
            "options": [],
            "correctAnswer": "Detailed model answer / grading guide derived directly from the study material.",
            "points": 5
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No Markdown.
        2. Options must be empty [].
        3. Questions must be derived directly from the study material provided above.
      `;
    } else {
      prompt = `
        You are an expert South African teacher. Create a JSON array of ${args.count} mixed (multiple choice and written open-ended) questions based ONLY on the provided study material.
        
        STUDY MATERIAL:
        ${targetMaterial.extractedText.slice(0, 4000)}

        DIFFICULTY/GRADE LEVEL: ${args.difficulty}
        
        STRICT JSON SCHEMA (Array of Objects):
        [
          {
            "questionText": "Multiple choice question?",
            "type": "MCQ",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "The exact option",
            "points": 1
          },
          {
            "questionText": "Written theory question?",
            "type": "SHORT_ANSWER",
            "options": [],
            "correctAnswer": "Detailed model answer / grading key.",
            "points": 5
          }
        ]

        RULES:
        1. Output ONLY raw JSON. No Markdown.
        2. Mix MCQ and SHORT_ANSWER questions.
        3. Questions must be derived directly from the study material provided above.
      `;
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const { text } = await generateText({
      prompt,
      model: google("gemini-2.5-flash"),
    });

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanJson);

    await ctx.runMutation("exams:updateExamQuestions" as any, {
      examId: args.examId,
      questions,
    });

    return { success: true };
  },
});
