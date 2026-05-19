import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getStudentOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "parent" || !user.linkedStudent) {
      return { error: "No linked student found." };
    }

    const studentId = user.linkedStudent;
    const student = await ctx.db.get(studentId);
    if (!student) return null;

    // Fetch student's class
    const studentClass = student.studentClass ? await ctx.db.get(student.studentClass) : null;

    // Fetch attendance
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("student", studentId))
      .order("desc")
      .take(10);

    // Fetch recent submissions/grades
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("student"), studentId))
      .collect();
    
    const grades = await Promise.all(submissions.map(async (s) => {
      const exam = await ctx.db.get(s.exam);
      const subject = exam ? await ctx.db.get(exam.subject) : null;
      return {
        subject: subject?.name || "Unknown",
        grade: `${s.score}%`,
        type: "Exam",
        date: new Date(s._creationTime).toLocaleDateString()
      };
    }));

    // Fetch fees
    const fees = await ctx.db
      .query("fees")
      .withIndex("by_student", (q) => q.eq("student", studentId))
      .collect();
    
    const totalDue = fees.filter(f => f.status !== "paid").reduce((acc, f) => acc + f.amount, 0);

    return {
      studentName: student.name,
      className: studentClass?.name || "Unassigned",
      attendanceRate: attendance.length > 0 
        ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100) 
        : 100,
      recentGrades: grades.slice(0, 5),
      totalFeesDue: totalDue,
      attendanceHistory: attendance.map(a => ({
        date: a.date,
        status: a.status
      })),
    };
  },
});
