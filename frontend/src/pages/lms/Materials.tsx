import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download, Plus } from "lucide-react";
import { FileUpload } from "@/components/global/FileUpload";
import { ingestMaterial } from "@/lib/cloudflareWorker";
import type { UploadResult } from "@/lib/cloudflareWorker";
import { toast } from "sonner";
import { useAuth } from "@/hooks/AuthProvider";

export default function MaterialsPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [objectKey, setObjectKey] = useState<string | null>(null);
  const [uploadFilename, setUploadFilename] = useState("");
  const [contentType, setContentType] = useState("application/octet-stream");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const materials = useQuery(api.lms.getMaterials, {});
  const subjects = useQuery(api.subjects.getSubjects);
  const createMaterial = useMutation(api.lms.createMaterial);
  const updateMaterialExtractedText = useMutation(api.lms.updateMaterialExtractedText);

  const handleUploadComplete = (result: UploadResult) => {
    setFileUrl(result.fileUrl);
    setObjectKey(result.objectKey);
    setContentType(result.contentType);
    const name = result.objectKey.includes("-")
      ? result.objectKey.slice(result.objectKey.indexOf("-") + 1)
      : result.objectKey;
    setUploadFilename(name);
  };

  const clearUpload = () => {
    setFileUrl(null);
    setObjectKey(null);
    setUploadFilename("");
    setContentType("application/octet-stream");
  };

  const handleSubmit = async () => {
    if (!title || !subjectId || !fileUrl || !objectKey) {
      return toast.error("Please fill in all fields and upload a file.");
    }

    setIsSubmitting(true);
    try {
      const materialId = await createMaterial({
        title,
        description,
        subjectId: subjectId as any,
        fileUrl,
      });

      try {
        const { extractedTextPreview, chunkCount } = await ingestMaterial({
          objectKey,
          filename: uploadFilename,
          contentType,
          subjectId,
          materialId: materialId as string,
          title,
          description,
        });
        if (extractedTextPreview) {
          await updateMaterialExtractedText({
            materialId,
            extractedText: extractedTextPreview,
          });
        }
        toast.success(`Material saved and indexed (${chunkCount} chunks for search).`);
      } catch (ingestError: unknown) {
        const msg =
          ingestError instanceof Error ? ingestError.message : "Indexing failed";
        toast.warning(`Material saved, but semantic indexing failed: ${msg}`);
      }

      setOpen(false);
      setTitle("");
      setDescription("");
      setSubjectId("");
      clearUpload();
    } catch (e: any) {
      toast.error(e.message || "Failed to save material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (materials === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
          <p className="text-muted-foreground">Access and manage educational resources stored securely on Cloudflare.</p>
        </div>
        {isTeacherOrAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 3: Algebra Notes" />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((s: any) => (
                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
                </div>
                
                <div className="space-y-2">
                  <Label>File Upload (Cloudflare R2)</Label>
                  {!fileUrl ? (
                    <FileUpload
                      onUploadComplete={handleUploadComplete}
                      accept=".pdf,.txt,.md"
                      metadata={{
                        subjectId: subjectId || undefined,
                        title: title || undefined,
                        description: description || undefined,
                      }}
                    />
                  ) : (
                    <div className="p-4 border rounded-md bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">File uploaded to R2</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearUpload}>
                        Change
                      </Button>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !fileUrl}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Material
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground italic border rounded-lg border-dashed">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            No study materials uploaded yet.
          </div>
        ) : (
          materials.map((item: any) => (
            <Card key={item._id} className="flex flex-col group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base truncate" title={item.title}>{item.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-1">{item.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    Download
                    <Download className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
