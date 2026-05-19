import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  Calendar,
  Award,
  ArrowLeft,
  Printer,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/hooks/AuthProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ExamRadio from "@/components/lms/ExamRadio";
import { cn } from "@/lib/utils";

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const [exam, setExam] = useState<any>(null);
  const convexExam = useQuery(api.exams.getExam, id ? { id: id as any } : "skip");
  const convexSubmissions = useQuery(api.submissions.getSubmissions, id ? { examId: id as any } : "skip");
  const submitConvexExam = useMutation(api.submissions.submitExam);
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<{ score: number; answers: { questionId: string; answer: string }[] } | null>(null);
  // Student Answers State: { [questionId]: "Selected Option" }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Print & PDF Customizer Options
  const [printIncludeHeader, setPrintIncludeHeader] = useState(true);
  const [printIncludeLines, setPrintIncludeLines] = useState(true);
  const [printIncludeMemo, setPrintIncludeMemo] = useState(false);

  useEffect(() => {
    if (convexExam !== undefined) {
      setExam(convexExam);
      setLoading(false);
    }
  }, [convexExam]);

  useEffect(() => {
    if (isStudent && convexSubmissions !== undefined) {
      // Find submission for current user if returned
      if (convexSubmissions.length > 0) {
        setSubmission(convexSubmissions[0]);
      }
    }
  }, [isStudent, convexSubmissions]);

  const totalPoints = submission && exam ? exam.questions.length : 0;
  const percentage =
    submission && totalPoints > 0
      ? Math.round((submission.score / totalPoints) * 100)
      : 0;

  if (loading || convexExam === undefined || (isStudent && convexSubmissions === undefined)) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    navigate("/lms/exams");
    return null;
  }

  if (!exam.isActive && !isTeacher) {
    navigate("/lms/exams");
    return null;
  }

  const isExpired = exam.isActive && new Date() > new Date(exam.dueDate);
  if ((!exam.isActive || isExpired) && !isTeacher) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <Clock className="h-12 w-12 text-accent-foreground" />
        <h2 className="text-xl font-bold">Exam Unavailable</h2>
        <p className="text-muted-foreground">
          This exam is currently closed or has expired.
        </p>
        <Button onClick={() => navigate("/lms/quizzes")}>Back to List</Button>
      </div>
    );
  }

  const handleTeacherDelete = async () => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      toast.error("Delete exam not implemented yet");
      navigate("/lms/quizzes");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleStudentSubmit = async () => {
    if (!exam) return;

    if (Object.keys(answers).length < exam.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans,
      }));

      const data = await submitConvexExam({
        examId: id as any,
        answers: payload,
      });
      toast.success(`Exam submitted! Score: ${data.score}`);
      navigate("/lms/exams");
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      toast.error("Toggle exam status not implemented yet");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 printable-area">
      {/* Printable CSS Rules Injected Natively */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
            font-family: 'Times New Roman', Times, serif !important;
          }
          nav, header, footer, button, .no-print, [role="tablist"], .sidebar, aside, .teacher-controls, .results-card, .toast-container {
            display: none !important;
          }
          .printable-area {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .printable-card {
            border: 1px solid #000 !important;
            border-radius: 0px !important;
            box-shadow: none !important;
            margin-bottom: 25px !important;
            page-break-inside: avoid !important;
          }
          .page-break-before {
            page-break-before: always !important;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="space-y-2 no-print">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <Badge variant={exam.isActive ? "default" : "secondary"}>
            {exam.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
        <div className="flex gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {exam.duration} Minutes
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Due:{" "}
            {new Date(exam.dueDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Printable Exam Paper Header (Standard CAPS Curriculum Assessment Layout) */}
      <div className={cn(
        "border-2 border-black p-4 rounded-none space-y-4 my-6 print:block hidden",
        printIncludeHeader ? "print:block" : "print:hidden"
      )}>
        <div className="text-center font-black tracking-widest text-lg uppercase border-b-2 border-black pb-1.5">
          Edunexus Curriculum Assessment
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div>SUBJECT: <span className="underline ml-1 font-semibold">{exam.subject?.name}</span></div>
          <div>CLASS / GRADE: <span className="underline ml-1 font-semibold">{exam.class?.name}</span></div>
          <div>TEACHER: <span className="underline ml-1 font-semibold">{exam.teacher?.name}</span></div>
          <div>DURATION: <span className="underline ml-1 font-semibold">{exam.duration} Minutes</span></div>
        </div>
        <div className="border-t border-black pt-3 grid grid-cols-2 gap-y-3 gap-x-6 text-[10px] font-extrabold uppercase">
          <div className="flex items-center gap-1">STUDENT NAME: <span className="flex-1 border-b border-black h-4 min-w-32 inline-block"></span></div>
          <div className="flex items-center gap-1">DATE: <span className="flex-1 border-b border-black h-4 min-w-32 inline-block"></span></div>
          <div className="flex items-center gap-1">MARKS OBTAINED: <span className="border border-black px-3 py-0.5 ml-1 text-xs"> / {exam.questions.reduce((acc: number, cur: any) => acc + (cur.points || 0), 0)}</span></div>
          <div className="flex items-center gap-1">SIGNATURE: <span className="flex-1 border-b border-black h-4 min-w-32 inline-block"></span></div>
        </div>
      </div>

      {/* Teacher Control: Toggle Status */}
      {isTeacher && (
        <div className="no-print">
          <Separator />
          <div className="bg-card p-4 rounded-lg flex items-center justify-between border teacher-controls">
            <div className="text-lg font-semibold">Teacher Controls</div>
            <div className="flex gap-2 ml-2">
              <Button onClick={() => navigate("/lms/exams")}>
                Back to List
              </Button>
              <Button
                variant={exam.isActive ? "destructive" : "default"}
                onClick={handleToggleStatus}
              >
                {exam.isActive ? "Unpublish Exam" : "Publish Exam"}
              </Button>
              <Button variant="destructive" onClick={handleTeacherDelete}>
                Delete Exam
              </Button>
            </div>
          </div>
          <Separator />
        </div>
      )}

      {/* Student Results Section */}
      {isStudent && submission && (
        <div className="no-print results-card">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Exam Results</h1>
                <p className="text-muted-foreground">You scored</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-primary">
                  {submission.score}
                </span>
                <span className="text-2xl text-muted-foreground">
                  / {totalPoints}
                </span>
              </div>
              <Badge
                variant={percentage >= 50 ? "default" : "destructive"}
                className="text-lg px-4 py-1"
              >
                {percentage}%
              </Badge>
            </CardContent>
          </Card>
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/lms/quizzes")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quizzes
            </Button>
            <h2 className="text-xl font-semibold ml-auto">Review Answers</h2>
          </div>
        </div>
      )}

      {/* Print / PDF Customizer Panel */}
      <Card className="no-print border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
        <CardHeader className="py-3 bg-zinc-100/50 dark:bg-zinc-900/60 flex flex-row items-center gap-2 border-b">
          <Printer className="w-4 h-4 text-violet-600" />
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">🖨️ PDF & Exam Paper Print Center</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Generate and print a pristine, curriculum-standard physical exam paper or save it directly as a vector PDF. Customize dotted handwriting columns and grading memorandum sheets.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-background border hover:bg-muted/30 transition-colors select-none">
              <input 
                type="checkbox" 
                checked={printIncludeHeader} 
                onChange={(e) => setPrintIncludeHeader(e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
              />
              <div className="text-xs">
                <span className="font-semibold block">Exam Info Header</span>
                <span className="text-[10px] text-muted-foreground">Name, marks, signature fields</span>
              </div>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-background border hover:bg-muted/30 transition-colors select-none">
              <input 
                type="checkbox" 
                checked={printIncludeLines} 
                onChange={(e) => setPrintIncludeLines(e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
              />
              <div className="text-xs">
                <span className="font-semibold block">Handwriting Lines</span>
                <span className="text-[10px] text-muted-foreground">Injects dotted lines for open answers</span>
              </div>
            </label>
            
            {isTeacher && (
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-background border hover:bg-muted/30 transition-colors select-none">
                <input 
                  type="checkbox" 
                  checked={printIncludeMemo} 
                  onChange={(e) => setPrintIncludeMemo(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-semibold block text-green-700 dark:text-green-400">Append Answer Key</span>
                  <span className="text-[10px] text-muted-foreground">Includes grading memorandum key</span>
                </div>
              </label>
            )}
          </div>
          
          <Button 
            onClick={() => window.print()} 
            className="w-full bg-violet-600 text-white hover:bg-violet-700 font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Open Print & PDF Generator
          </Button>
        </CardContent>
      </Card>

      {/* questions list */}
      <div className="space-y-6">
        {exam.questions.map((q: any, index: number) => (
          <Card key={q._id || index} className="printable-card">
            <CardHeader className="pb-3 print:pb-2">
              <CardTitle className="text-lg font-medium flex gap-2 items-start print:text-sm print:font-bold">
                <span className="text-muted-foreground print:text-black">{index + 1}.</span>
                <span className="flex-1">{q.questionText}</span>
                <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded print:bg-transparent print:text-black print:font-extrabold print:border print:border-black shrink-0">
                  {q.points} pts
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="print:pt-1">
              {q.type === "SHORT_ANSWER" ? (
                // SHORT ANSWER / ESSAY FORMAT
                <div className="space-y-3 print:space-y-0">
                  {isTeacher ? (
                    // Teacher view: Show memorandum guide
                    <div className="p-4 bg-muted/50 dark:bg-[#1c1c1c] border rounded-lg space-y-1.5 print:bg-transparent print:border-black">
                      <span className="text-xs font-bold text-muted-foreground print:text-black uppercase tracking-wider block">
                        📝 Model Solution / Grading Guidelines:
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/95 italic print:text-black print:not-italic">
                        {q.correctAnswer}
                      </p>
                    </div>
                  ) : (
                    // Student view: Show Textarea for inputs
                    <div className="space-y-3 no-print">
                      <Textarea
                        placeholder={submission ? "No answer written" : "Type your detailed explanation or essay response here..."}
                        className="min-h-[120px] bg-background/50 border-muted focus:border-primary transition-all resize-y text-sm leading-relaxed"
                        value={submission ? (submission.answers.find(a => a.questionId === q._id)?.answer || "") : (answers[q._id] || "")}
                        onChange={(e) => {
                          if (submission) return;
                          setAnswers(prev => ({ ...prev, [q._id]: e.target.value }));
                        }}
                        disabled={!!submission}
                      />
                      {submission && (
                        <div className="mt-3 p-4 bg-violet-600/10 dark:bg-violet-600/5 border border-violet-600/20 rounded-lg space-y-1.5">
                          <div className="text-xs font-bold text-violet-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Correct Answer / Model Guide:
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/90 italic">
                            {q.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Printed handwriting lines helper */}
                  {printIncludeLines && (
                    <div className="hidden print:block space-y-4 pt-4">
                      <div className="border-b border-dashed border-gray-400 h-6"></div>
                      <div className="border-b border-dashed border-gray-400 h-6"></div>
                      <div className="border-b border-dashed border-gray-400 h-6"></div>
                      <div className="border-b border-dashed border-gray-400 h-6"></div>
                    </div>
                  )}
                </div>
              ) : (
                // MULTIPLE CHOICE MCQ FORMAT
                <div>
                  {isTeacher ? (
                    // TEACHER VIEW: List options, highlight correct one
                    <ul className="space-y-2 print:space-y-1">
                      {q.options?.map((opt: string, i: number) => (
                        <li
                          key={i}
                          className={`p-3 rounded-md border flex items-center gap-2 print:text-xs print:p-1.5 ${
                            opt === q.correctAnswer
                              ? "bg-primary font-medium print:bg-zinc-200 print:border-black print:font-bold"
                              : "bg-black/20 dark:bg-black/70 print:bg-transparent"
                          }`}
                        >
                          {opt === q.correctAnswer && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          <span className="text-sm print:text-xs">{opt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // STUDENT VIEW: Radio Group
                    <div className="no-print">
                      <ExamRadio
                        answers={answers}
                        question={q}
                        setAnswers={setAnswers}
                        submission={submission as any}
                      />
                    </div>
                  )}

                  {/* Printable view simple options list */}
                  {!isTeacher && !submission && (
                    <ul className="hidden print:block space-y-1.5 mt-2">
                      {q.options?.map((opt: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <span className="w-3.5 h-3.5 rounded-full border border-black inline-block shrink-0"></span>
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Printable Memo Section */}
      {printIncludeMemo && isTeacher && (
        <div className="hidden print:block page-break-before space-y-6 pt-8 border-t-2 border-double border-black">
          <div className="text-center font-black tracking-widest text-lg uppercase border-b-2 border-black pb-1.5">
            MEMORANDUM / ANSWER KEY (CONFIDENTIAL)
          </div>
          <div className="space-y-4">
            {exam.questions.map((q: any, index: number) => (
              <div key={q._id || index} className="border border-black p-4 rounded-none space-y-2 page-break-inside-avoid">
                <div className="font-bold flex justify-between text-xs">
                  <span>Question {index + 1}: {q.questionText}</span>
                  <span>[{q.points} Marks]</span>
                </div>
                <div className="text-xs bg-zinc-100 p-2 rounded-none border border-black font-semibold">
                  {q.type === "MCQ" ? (
                    <span>Correct Answer Option: <strong className="text-black font-extrabold">{q.correctAnswer}</strong></span>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-extrabold block mb-0.5">Model Answer Guide:</span>
                      <p className="font-normal italic text-zinc-950">{q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-4 no-print">
        {isStudent && !submission && (
          <Button
            size="lg"
            className="w-full md:w-auto min-w-50"
            onClick={handleStudentSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit Exam"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Exam;
