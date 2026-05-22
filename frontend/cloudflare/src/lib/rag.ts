import type { Env } from "../env";
import { embedQuery } from "./embeddings";

export interface RagMatch {
  id: string;
  score: number;
  text: string;
  title?: string;
  subjectId?: string;
  materialId?: string;
  objectKey?: string;
}

export async function searchMaterials(
  env: Env,
  query: string,
  options?: { subjectId?: string; topK?: number }
): Promise<RagMatch[]> {
  if (!env.VECTOR_INDEX) throw new Error("VECTOR_INDEX binding is not configured.");

  const vector = await embedQuery(env, query);
  const topK = options?.topK ?? 5;

  const result = await env.VECTOR_INDEX.query(vector, {
    topK,
    returnMetadata: "all",
    filter: options?.subjectId ? { subjectId: options.subjectId } : undefined,
  });

  return (result.matches || []).map((match) => {
    const metadata = (match.metadata || {}) as Record<string, string | number>;
    return {
      id: match.id,
      score: match.score,
      text: String(metadata.text || ""),
      title: metadata.title ? String(metadata.title) : undefined,
      subjectId: metadata.subjectId ? String(metadata.subjectId) : undefined,
      materialId: metadata.materialId ? String(metadata.materialId) : undefined,
      objectKey: metadata.objectKey ? String(metadata.objectKey) : undefined,
    };
  });
}

export function buildRagContext(matches: RagMatch[]): string {
  if (matches.length === 0) return "";

  const sections = matches
    .filter((m) => m.text)
    .map((m, i) => {
      const heading = m.title ? `Source ${i + 1}: ${m.title}` : `Source ${i + 1}`;
      return `--- ${heading} ---\n${m.text}`;
    });

  return `\n\nRELEVANT STUDY MATERIALS (semantic search):\n${sections.join("\n\n")}`;
}
