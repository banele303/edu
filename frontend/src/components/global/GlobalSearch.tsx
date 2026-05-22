import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Search, Loader2, FileText, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  const results = useQuery(api.search.globalSearch, { query: query }) || [];
  const isLoading = query.length > 0 && results.length === 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full max-w-sm cursor-pointer group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input 
            placeholder="Ask AI to find anything..." 
            className="pl-9 bg-muted/50 border-white/10 hover:bg-muted/80 transition-colors rounded-full"
            readOnly
          />
          <div className="absolute right-2 top-2 bg-background border px-1.5 rounded text-[10px] font-bold text-muted-foreground">
            ⌘K
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden gap-0 bg-background/95 backdrop-blur-xl border-white/10">
        <form onSubmit={handleSearch} className="flex items-center px-4 py-3 border-b border-white/10">
          <Sparkles className="h-5 w-5 text-primary mr-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            placeholder="Describe what you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </form>
        
        <div className="max-h-[300px] overflow-y-auto p-2">
          {results.length === 0 && !isLoading && query && (
            <div className="text-center py-10 text-muted-foreground">No semantic matches found.</div>
          )}
          {results.length === 0 && !isLoading && !query && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <p>Try searching for concepts, not just filenames.</p>
              <p className="mt-1 italic opacity-70">"Notes about cell division"</p>
            </div>
          )}
          
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.type} • AI Match: {(r.score * 100).toFixed(0)}%</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
