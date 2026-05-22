import { useState } from "react";
import { Search, BookOpen, Tag, CheckCircle2, Eye } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const QUESTION_TYPE_BADGES: Record<string, { label: string; color: string }> = {
  MCQ: { label: "MCQ", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  TRUE_FALSE: { label: "T/F", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  FILL_BLANK: { label: "Fill Blank", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  SHORT_ANSWER: { label: "Short Answer", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ESSAY: { label: "Essay", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  MATCH_COLUMN: { label: "Match", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  CALCULATION: { label: "Calculation", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  DIAGRAM_LABEL: { label: "Diagram", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
};

const QuestionBank = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const subjects = useQuery(api.subjects.getSubjects) || [];

  // Build query args
  const bankQuery: any = { isPublished: true };
  if (filterType !== "all") bankQuery.type = filterType;
  if (filterDifficulty !== "all") bankQuery.difficulty = filterDifficulty;
  if (filterSubject !== "all") bankQuery.subjectId = filterSubject;

  const questionBank = useQuery(api.exams.getQuestionBank, bankQuery) || [];

  // Filter by search query client-side
  const filteredQuestions = questionBank.filter((q: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.questionText?.toLowerCase().includes(query) ||
      q.topic?.toLowerCase().includes(query) ||
      q.tags?.some((t: string) => t.toLowerCase().includes(query))
    );
  });

  if (!isTeacher) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Only teachers can access the question bank.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-violet-600" />
            Question Bank
          </h1>
          <p className="text-muted-foreground">
            Browse and reuse AI-generated questions. {questionBank.length} questions available.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions by text, topic, or tag..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="MCQ">MCQ</SelectItem>
            <SelectItem value="TRUE_FALSE">True/False</SelectItem>
            <SelectItem value="FILL_BLANK">Fill Blank</SelectItem>
            <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
            <SelectItem value="ESSAY">Essay</SelectItem>
            <SelectItem value="MATCH_COLUMN">Match Column</SelectItem>
            <SelectItem value="CALCULATION">Calculation</SelectItem>
            <SelectItem value="DIAGRAM_LABEL">Diagram</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s: any) => (
              <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question Type Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(QUESTION_TYPE_BADGES).map(([type, config]) => {
          const count = questionBank.filter((q: any) => q.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterType === type
                  ? config.color + " border-current"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
              )}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-muted-foreground">
            {questionBank.length === 0
              ? "No questions in the bank yet. Generate an exam to populate the bank."
              : "No questions match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q: any) => {
            const typeConfig = QUESTION_TYPE_BADGES[q.type] || { label: q.type, color: "bg-gray-100 text-gray-700" };
            return (
              <Card key={q._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={cn("text-xs", typeConfig.color)}>
                      {typeConfig.label}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{q.points} pts</span>
                      {q.difficulty && (
                        <Badge variant="outline" className="text-[10px]">
                          {q.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium line-clamp-2 mb-2">{q.questionText}</p>

                  {/* Options preview for MCQ */}
                  {q.type === "MCQ" && q.options && (
                    <div className="space-y-1 mt-2">
                      {q.options.map((opt: string, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "text-xs px-2 py-1 rounded",
                            opt === q.correctAnswer
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + i)}) {opt}
                          {opt === q.correctAnswer && (
                            <CheckCircle2 className="h-3 w-3 inline ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {q.tags.slice(0, 4).map((tag: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Topic */}
                  {q.topic && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      📚 {q.topic}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] text-muted-foreground">
                      Used {q.timesUsed || 0} times
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Question Detail Dialog */}
      <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuestion && (
                <Badge className={QUESTION_TYPE_BADGES[selectedQuestion.type]?.color}>
                  {QUESTION_TYPE_BADGES[selectedQuestion.type]?.label || selectedQuestion.type}
                </Badge>
              )}
              Question Details
            </DialogTitle>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Question</h4>
                <p className="text-sm p-3 bg-muted/30 rounded-lg">{selectedQuestion.questionText}</p>
              </div>

              {selectedQuestion.type === "MCQ" && selectedQuestion.options && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Options</h4>
                  <div className="space-y-1">
                    {selectedQuestion.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "text-sm px-3 py-2 rounded border",
                          opt === selectedQuestion.correctAnswer
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 font-medium"
                            : "bg-background"
                        )}
                      >
                        {String.fromCharCode(65 + i)}) {opt}
                        {opt === selectedQuestion.correctAnswer && (
                          <CheckCircle2 className="h-4 w-4 text-green-600 inline ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-1">Correct Answer</h4>
                <p className="text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  {selectedQuestion.correctAnswer}
                </p>
              </div>

              {selectedQuestion.matchPairs && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Match Pairs</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedQuestion.matchPairs.map((p: any, i: number) => (
                      <div key={i} className="text-sm p-2 bg-muted/30 rounded flex justify-between">
                        <span>{p.left}</span>
                        <span className="text-green-600">→ {p.right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Points: {selectedQuestion.points}</span>
                <span>Difficulty: {selectedQuestion.difficulty || "N/A"}</span>
                <span>Topic: {selectedQuestion.topic || "N/A"}</span>
                <span>Used: {selectedQuestion.timesUsed || 0} times</span>
              </div>

              {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedQuestion.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBank;
