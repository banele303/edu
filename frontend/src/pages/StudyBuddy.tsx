import { useState, useRef, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Send, Loader2, Sparkles, Lightbulb, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function StudyBuddyPage() {
  const [input, setInput] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm EduBot 🤖 Your AI study assistant. Select a subject and ask me anything — I'll help you understand concepts, prepare for exams, and work through homework!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const subjects = useQuery(api.subjects.getSubjects);
  const askStudyBuddy = useAction(api.studyBuddy.askStudyBuddy);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await askStudyBuddy({
        question,
        subjectId: (subjectId || undefined) as any,
        conversationHistory: history,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch (e: any) {
      console.error(e);
      toast.error("EduBot couldn't answer right now. Try again!");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble generating a response. Please check your connection and try again! 🙁",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Explain photosynthesis in simple terms",
    "Help me solve this: 2x + 5 = 15",
    "What were the causes of World War 1?",
    "Give me 5 tips for exam preparation",
  ];

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-72 border-r bg-gray-50 dark:bg-[#1c1c1c] flex flex-col shrink-0">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#dc2626] p-2 rounded-lg">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-bold text-sm">EduBot</h2>
              <p className="text-xs text-muted-foreground">AI Study Buddy</p>
            </div>
          </div>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select subject..." />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((s: any) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Prompts
          </h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="w-full text-left text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-[#121212] transition-colors flex items-start gap-2"
              >
                <Lightbulb className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="bg-[#dc2626]/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3 inline text-[#dc2626] mr-1" />
              EduBot uses your school's study materials to provide accurate, curriculum-aligned answers.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b px-6 flex items-center gap-3 shrink-0 bg-white dark:bg-[#121212]">
          <MessageSquare className="h-5 w-5 text-[#dc2626]" />
          <div>
            <p className="font-medium text-sm">Study with EduBot</p>
            <p className="text-xs text-muted-foreground">
              {subjectId
                ? `Discussing: ${subjects?.find((s: any) => s._id === subjectId)?.name || "..."}`
                : "General study help"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-[#dc2626] text-black rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#dc2626]" />
                    <span className="text-[10px] font-bold text-[#dc2626]">EduBot</span>
                  </div>
                )}
                <div className="whitespace-normal leading-relaxed text-sm select-text">
                  <MarkdownRenderer content={msg.content} />
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#dc2626]" />
                <span className="text-sm text-muted-foreground">EduBot is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white dark:bg-[#121212]">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Textarea
              placeholder="Ask EduBot anything about your studies..."
              className="min-h-[52px] max-h-32 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              className="h-[52px] w-[52px] shrink-0 bg-[#dc2626] text-black hover:bg-[#b91c1c]"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
