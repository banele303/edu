import { useState } from "react";
import { UploadCloud, Loader2, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CLOUDFLARE_WORKER_URL, type UploadResult } from "@/lib/cloudflareWorker";

export interface FileUploadMetadata {
  subjectId?: string;
  title?: string;
  description?: string;
  materialId?: string;
}

interface FileUploadProps {
  onUploadComplete: (result: UploadResult) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  metadata?: FileUploadMetadata;
}

export function FileUpload({
  onUploadComplete,
  className,
  accept,
  maxSize = 10,
  metadata,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setIsUploading(true);
    try {
      const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type || "application/octet-stream",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get upload URL. Is the Cloudflare Worker running?");
      }

      const { uploadUrl, fileUrl, objectKey } = await res.json();

      const uploadMetadata = {
        filename: fileToUpload.name,
        contentType: fileToUpload.type || "application/octet-stream",
        ...metadata,
      };

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileToUpload.type || "application/octet-stream",
          "X-Upload-Metadata": JSON.stringify(uploadMetadata),
        },
        body: fileToUpload,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to Cloudflare R2.");
      }

      toast.success("File uploaded to Cloudflare R2.");
      onUploadComplete({
        fileUrl,
        objectKey,
        contentType: fileToUpload.type || "application/octet-stream",
      });
      setFile(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during upload.";
      toast.error(message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-6 transition-colors",
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept={accept}
        disabled={isUploading}
      />

      <div className="flex flex-col items-center justify-center text-center space-y-3">
        {isUploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        ) : file ? (
          <File className="h-10 w-10 text-primary" />
        ) : (
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
        )}

        <div>
          {isUploading ? (
            <p className="text-sm font-medium">Uploading to Cloudflare R2...</p>
          ) : file ? (
            <p className="text-sm font-medium">{file.name}</p>
          ) : (
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
          )}
          {!isUploading && !file && (
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, TXT, MD (up to {maxSize}MB). Indexed for semantic search after save.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
