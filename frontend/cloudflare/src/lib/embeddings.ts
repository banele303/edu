import type { Env } from "../env";

const EMBEDDING_MODEL = "@cf/baai/bge-small-en-v1.5";

type EmbeddingResponse = { data: number[][] };

export async function embedTexts(env: Env, texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const batchSize = 32;
  const vectors: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const result = (await env.AI.run(EMBEDDING_MODEL, {
      text: batch,
    })) as EmbeddingResponse;

    if (!result?.data?.length) {
      throw new Error("Embedding model returned no vectors.");
    }
    vectors.push(...result.data);
  }

  return vectors;
}

export async function embedQuery(env: Env, query: string): Promise<number[]> {
  const [vector] = await embedTexts(env, [query]);
  if (!vector) throw new Error("Failed to embed query.");
  return vector;
}
