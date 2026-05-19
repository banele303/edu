import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Sparkles, CheckCircle2, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Id } from "../../../convex/_generated/dataModel";

export default function AssignmentDetails() {
  const { id } = useParams();
  const [isAiGrading, setIsAiGrading] = useState<string | null>(null);
  
  const submissions = useQuery(api.lms.getAssignmentSubmissions, { 
    assignmentId: id as Id<"assignments"> 
  });
  
  const gradeWithAI = useAction(api.grading.gradeWithAI);

  const handleAiGrade = async (submission: any) => {
    setIsAiGrading(submission._id);
    try {
      const result = await gradeWithAI({ submissionId: submission._id });
      toast.success(`AI Grade generated: ${result.suggestedGrade}%`);
    } catch (e: any) {
      toast.error(e.message || "AI Grading failed.");
    } finally {
      setIsAiGrading(null);
    }
  };

  if (submissions === undefined) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Submissions</h1>
          <p className="text-muted-foreground mt-1">Review and grade student work with AI assistance.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <CardContent>
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No submissions yet.</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((s: any) => (
            <Card key={s._id} className="overflow-hidden border-primary/10">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{s.studentName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Submitted {new Date(s.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={s.status === "graded" ? "default" : "secondary"} className="ml-auto">
                      {s.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-xl border mb-4">
                    <p className="text-sm font-medium mb-2">Student Response:</p>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                  </div>

                  {s.status === "graded" && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Final Grade: {s.grade}%
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">{s.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="bg-muted/20 border-l p-6 md:w-64 flex flex-col justify-center gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5"
                    onClick={() => handleAiGrade(s)}
                    disabled={isAiGrading === s._id}
                  >
                    {isAiGrading === s._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
                    {s.status === "graded" ? "Regenerate AI Grade" : "AI Assisted Grade"}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full text-xs" disabled>
                    Manual Override
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
