import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Megaphone, Loader2, Sparkles, Trash2, AlertTriangle, Info, Volume2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const priorityConfig = {
  urgent: { label: "Urgent", icon: AlertTriangle, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  normal: { label: "Normal", icon: Megaphone, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  low: { label: "Info", icon: Info, color: "text-muted-foreground bg-muted border" },
};

export default function AnnouncementsPage() {
  const announcements = useQuery(api.announcements.getAnnouncements);
  const createAnnouncement = useMutation(api.announcements.createAnnouncement);
  const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement);
  const generateAI = useAction(api.announcements.generateAnnouncement);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "urgent">("normal");
  const [targetRoles, setTargetRoles] = useState(["all"]);
  const [aiInput, setAiInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async () => {
    if (!aiInput.trim()) return toast.error("Please enter bullet points for the AI to work with.");
    setIsGenerating(true);
    try {
      const { text } = await generateAI({ bulletPoints: aiInput });
      const lines = text.split("\n").filter(Boolean);
      setTitle(lines[0] || "");
      setContent(lines.slice(1).join("\n").trim());
      toast.success("AI draft generated!");
    } catch (e: any) {
      toast.error(e.message || "AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Title and content are required.");
    setIsSubmitting(true);
    try {
      await createAnnouncement({ title, content, priority, targetRoles });
      toast.success("Announcement posted!");
      setOpen(false);
      setTitle(""); setContent(""); setAiInput("");
    } catch (e: any) {
      toast.error(e.message || "Failed to post announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">School-wide notices and communications.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" /> Create Announcement
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* AI Helper */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Draft Generator
                </p>
                <Textarea
                  placeholder="e.g. Parent evening on Nov 15, 6pm. Smart casual dress. Bring school reports."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="bg-background min-h-[70px]"
                />
                <Button size="sm" variant="secondary" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isGenerating ? "Generating..." : "Generate Draft"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[120px]" placeholder="Full announcement text..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low / Info</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select value={targetRoles[0]} onValueChange={(v) => setTargetRoles([v])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                      <SelectItem value="teacher">Teachers Only</SelectItem>
                      <SelectItem value="parent">Parents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements === undefined ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : announcements.length === 0 ? (
          <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground"><Megaphone className="h-8 w-8" /><p>No announcements yet.</p></CardContent></Card>
        ) : (
          announcements.map((ann) => {
            const cfg = priorityConfig[ann.priority];
            const Icon = cfg.icon;
            return (
              <Card key={ann._id} className={cn("border", ann.priority === "urgent" && "border-red-500/30 bg-red-500/5")}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn("p-2 rounded-lg border", cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg">{ann.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(ann._creationTime), { addSuffix: true })} · for{" "}
                          <span className="capitalize">{ann.targetRoles.join(", ")}</span>
                        </p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => deleteAnnouncement({ id: ann._id })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ann.content}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
