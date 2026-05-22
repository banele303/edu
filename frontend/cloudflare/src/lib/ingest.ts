import type { Env, IngestResult, UploadMetadata } from "../env";
import { chunkText } from "./chunk";
import { extractTextFromBuffer } from "./extract";
import { embedTexts } from "./embeddings";

const PREVIEW_LENGTH = 4000;

export function vectorIdForChunk(objectKey: string, index: number, materialId?: string): string {
  const prefix = materialId || objectKey;
  return `${prefix}::${index}`;
}

export async function ingestR2Object(
  env: Env,
  objectKey: string,
  meta: UploadMetadata
): Promise<IngestResult> {
  if (!env.STORAGE) throw new Error("R2 STORAGE binding is not configured.");
  if (!env.VECTOR_INDEX) throw new Error("VECTOR_INDEX binding is not configured.");

  const object = await env.STORAGE.get(objectKey);
  if (!object) throw new Error(`Object not found in R2: ${objectKey}`);

  const contentType =
    object.httpMetadata?.contentType || meta.contentType || "application/octet-stream";
  const buffer = await object.arrayBuffer();
  const filename = meta.filename || objectKey;

  let text = await extractTextFromBuffer(buffer, contentType, filename);
  const fallbackParts = [meta.title, meta.description].filter(Boolean);
  if (!text && fallbackParts.length > 0) {
    text = fallbackParts.join("\n\n");
  }
  if (!text) {
    throw new Error(
      "No extractable text found. Supported: TXT, MD, CSV, PDF. Add a title/description for other file types."
    );
  }

  const chunks = chunkText(text);
  if (chunks.length === 0) {
    throw new Error("Document produced no text chunks.");
  }

  const vectors = await embedTexts(env, chunks);
  const vectorIds = chunks.map((_, i) =>
    vectorIdForChunk(objectKey, i, meta.materialId)
  );

  await env.VECTOR_INDEX.upsert(
    vectors.map((values, i) => ({
      id: vectorIds[i],
      values,
      metadata: {
        objectKey,
        chunkIndex: i,
        text: chunks[i].slice(0, 500),
        subjectId: meta.subjectId || "",
        materialId: meta.materialId || "",
        title: meta.title || meta.filename || objectKey,
        filename,
        contentType,
      },
    }))
  );

  return {
    objectKey,
    chunkCount: chunks.length,
    extractedTextPreview: text.slice(0, PREVIEW_LENGTH),
    vectorIds,
  };
}

export async function deleteVectorsForMaterial(
  env: Env,
  objectKey: string,
  materialId?: string,
  maxChunks = 200
): Promise<void> {
  if (!env.VECTOR_INDEX) return;

  const ids = Array.from({ length: maxChunks }, (_, i) =>
    vectorIdForChunk(objectKey, i, materialId)
  );
  try {
    await env.VECTOR_INDEX.deleteByIds(ids);
  } catch {
    // Index may not have prior vectors
  }
}
