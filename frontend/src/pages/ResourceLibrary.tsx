import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const capsApi = api as any;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, BookOpen, Download, Search } from "lucide-react";

export default function ResourceLibrary() {
  const [selectedGrade, setSelectedGrade] = useState<number>(0); // 0 = all
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("past-papers");

  const allSubjects = useQuery(capsApi.capsActions?.getCapsSubjects, {});
  const pastPapers = useQuery(capsApi.capsActions?.getPastPapers, selectedGrade ? { grade: selectedGrade } : {});
  const studyResources = useQuery(capsApi.capsActions?.getStudyResources, selectedGrade ? { grade: selectedGrade } : {});

  const langName = (code: string) => {
    const map: Record<string, string> = { en: "English", zu: "isiZulu", xh: "isiXhosa", af: "Afrikaans", nso: "Sepedi", tn: "Setswana", st: "Sesotho", ts: "Xitsonga", ss: "siSwati", ve: "Tshivenda", nr: "isiNdebele" };
    return map[code] || code;
  };



  const filterBySearch = (items: any[]) => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((i: any) => i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource Library</h1>
        <p className="text-muted-foreground">Browse past papers, study materials, and syllabus content for all grades and languages.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9"
          />
        </div>
        <div>
          <Select value={String(selectedGrade)} onValueChange={(v) => setSelectedGrade(Number(v))}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Grades</SelectItem>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="af">Afrikaans</SelectItem>
              <SelectItem value="zu">isiZulu</SelectItem>
              <SelectItem value="xh">isiXhosa</SelectItem>
              <SelectItem value="nso">Sepedi</SelectItem>
              <SelectItem value="tn">Setswana</SelectItem>
              <SelectItem value="st">Sesotho</SelectItem>
              <SelectItem value="ts">Xitsonga</SelectItem>
              <SelectItem value="ss">siSwati</SelectItem>
              <SelectItem value="ve">Tshivenda</SelectItem>
              <SelectItem value="nr">isiNdebele</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="past-papers">Past Papers</TabsTrigger>
          <TabsTrigger value="study-materials">Study Materials</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        <TabsContent value="past-papers" className="space-y-4">
          {pastPapers === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filterBySearch(pastPapers).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No past papers found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(pastPapers).map((pp: any) => (
                <Card key={pp._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{pp.paperType}</Badge>
                      <Badge variant="outline" className="text-xs">Grade {pp.grade}</Badge>
                      <Badge variant="outline" className="text-xs">{pp.year}</Badge>
                    </div>
                    <CardTitle className="text-base">{pp.title}</CardTitle>
                    <CardDescription className="text-xs">{langName(pp.language)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pp.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={pp.fileUrl} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-3 w-3" /> Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="study-materials" className="space-y-4">
          {studyResources === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filterBySearch(studyResources).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No study materials found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(studyResources).map((r: any) => (
                <Card key={r._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{r.resourceType}</Badge>
                      <Badge variant="outline" className="text-xs">Grade {r.grade}</Badge>
                    </div>
                    <CardTitle className="text-base">{r.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{r.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={r.fileUrl} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-3 w-3" /> Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="syllabus" className="space-y-4">
          {allSubjects === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-6">
              {["Foundation", "Intermediate", "Senior", "FET"].map(phase => {
                const phaseSubjects = allSubjects.filter((s: any) => s.phase === phase);
                if (phaseSubjects.length === 0) return null;
                return (
                  <div key={phase}>
                    <h3 className="text-lg font-bold mb-3">{phase} Phase</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {phaseSubjects.map((s: any) => (
                        <Card key={s._id} className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{s.name}</h4>
                            <Badge variant={s.isCompulsory ? "default" : "outline"} className="text-[10px]">
                              {s.isCompulsory ? "Compulsory" : "Elective"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Grade {s.grade} • {s.code}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
