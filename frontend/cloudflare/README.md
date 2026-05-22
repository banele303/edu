# EduNexus Cloudflare Worker

Pipeline: **R2 upload → text extraction & chunking → Workers AI embeddings → Vectorize**.

## Setup

1. Create an R2 bucket named `edunexus-storage` in the Cloudflare dashboard (or update `wrangler.toml`).
2. Create a Vectorize index `edunexus-materials` with **384 dimensions** (for `@cf/baai/bge-small-en-v1.5`):

   ```bash
   npx wrangler vectorize create edunexus-materials --dimensions=384 --metric=cosine
   ```

3. Install and run locally:

   ```bash
   npm install
   npm run dev
   ```

4. Set `VITE_CLOUDFLARE_WORKER_URL` in the frontend `.env.local` (default `http://localhost:8787`).

5. Deploy:

   ```bash
   npm run deploy
   ```

## API

| Endpoint | Description |
|----------|-------------|
| `POST /api/upload-url` | Returns `objectKey`, `uploadUrl`, `fileUrl` |
| `PUT /api/upload-proxy/:key` | Stores file in R2; optional background ingest via `X-Upload-Metadata` |
| `POST /api/ingest` | Extract, chunk, embed, upsert into Vectorize |
| `POST /api/material-search` | Semantic search over ingested chunks |
| `POST /api/chat` | Study buddy chat with Vectorize RAG context |
| `GET /api/files/:key` | Dev file download when `R2_PUBLIC_URL` is empty |

## Production

Set `R2_PUBLIC_URL` in `wrangler.toml` to your R2 custom domain or public `r2.dev` URL.
