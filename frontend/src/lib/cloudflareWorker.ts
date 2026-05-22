export const CLOUDFLARE_WORKER_URL =
  import.meta.env.VITE_CLOUDFLARE_WORKER_URL || "http://localhost:8787";

export interface UploadResult {
  fileUrl: string;
  objectKey: string;
  contentType: string;
}

export interface IngestPayload {
  objectKey: string;
  filename: string;
  contentType: string;
  subjectId: string;
  materialId: string;
  title: string;
  description?: string;
}

export async function ingestMaterial(payload: IngestPayload): Promise<{
  extractedTextPreview: string;
  chunkCount: number;
}> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to index material for semantic search.");
  }

  const data = await res.json();
  return {
    extractedTextPreview: data.extractedTextPreview || "",
    chunkCount: data.chunkCount || 0,
  };
}
