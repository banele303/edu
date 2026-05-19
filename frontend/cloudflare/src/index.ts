import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  AI: any;
  STORAGE?: R2Bucket;
  VECTOR_INDEX?: VectorizeIndex;
  CONVEX_URL?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("EduNexus AI & Storage Worker is online.");
});

// AI Chat Endpoint (Study Buddy)
app.post("/api/chat", async (c) => {
  try {
    const { messages, subjectId } = await c.req.json();
    
    // In the future: Search Vectorize using subjectId
    // const embedding = await c.env.AI.run("@cf/baai/bge-small-en-v1.5", { text: messages[messages.length - 1].content });
    // const matches = await c.env.VECTOR_INDEX.query(embedding.data[0], { topK: 3, filter: { subjectId } });
    
    // For now, simple fallback to Llama 3
    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: "You are EduBot, a helpful AI study buddy for South African school students (Grade 5 to 12)." },
        ...messages
      ],
      max_tokens: 1024
    });

    return c.json({ response: response.response });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// R2 Pre-signed URL for File Uploads
app.post("/api/generate-path", async (c) => {
  try {
    const prompt = `You are an expert educator. Generate a personalized, weekly learning path for a student.
Identify 3 key focus areas and suggest actionable study activities.
Return the result STRICTLY as a raw JSON string. Do not include markdown code blocks.

Schema:
{
  "overview": "Short encouraging message",
  "focusAreas": [
    { "topic": "Name of topic", "reason": "Why focus here", "activities": ["Activity 1", "Activity 2"] }
  ]
}`;

    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 1024
    });

    return c.json({ response: response.response });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// R2 Pre-signed URL for File Uploads
app.post("/api/upload-url", async (c) => {
  try {
    const { filename, contentType } = await c.req.json();
    
    if (!c.env.STORAGE) {
      return c.json({ error: "R2 STORAGE binding is not configured." }, 400);
    }

    const objectKey = `${crypto.randomUUID()}-${filename}`;
    
    // Note: Cloudflare Workers cannot easily generate standard S3 pre-signed URLs natively without extra libraries.
    // However, we can use the worker itself as a proxy for uploads.
    // For a robust implementation, we would use aws4fetch to generate a pre-signed URL to the R2 S3 API.
    
    return c.json({ 
      uploadUrl: `https://${c.req.header("host")}/api/upload-proxy/${objectKey}`,
      fileUrl: `https://your-custom-domain.com/${objectKey}` // Replace with actual R2 public domain
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.put("/api/upload-proxy/:key", async (c) => {
  const key = c.req.param("key");
  if (!c.env.STORAGE) return c.json({ error: "STORAGE not bound" }, 500);
  
  await c.env.STORAGE.put(key, c.req.raw.body);
  return c.json({ success: true, key });
});

// AI Global Semantic Search
app.post("/api/search", async (c) => {
  try {
    const { query, items } = await c.req.json();
    
    const prompt = `You are an AI search assistant. Given a user search query and a list of items (materials, subjects, announcements), identify the top 3 most relevant items.
    
Query: "${query}"
Items: ${JSON.stringify(items)}

Return the result STRICTLY as a JSON array of the IDs of the top 3 most relevant items.
Example: ["id1", "id2", "id3"]`;

    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512
    });

    // Extract JSON array from response
    const startIdx = response.response.indexOf('[');
    const endIdx = response.response.lastIndexOf(']');
    const ids = JSON.parse(response.response.substring(startIdx, endIdx + 1));

    return c.json({ ids });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// AI Assignment Grader
app.post("/api/grade-assignment", async (c) => {
  try {
    const { submission, assignment } = await c.req.json();
    
    const prompt = `You are a teacher grading a student assignment.
Assignment Title: ${assignment.title}
Instructions: ${assignment.description}
Student Submission: ${submission.content}

Grade the student out of ${assignment.maxPoints || 100}.
Provide short constructive feedback.
Return as JSON: { "grade": number, "feedback": "string" }`;

    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024
    });

    const startIdx = response.response.indexOf('{');
    const endIdx = response.response.lastIndexOf('}');
    const result = JSON.parse(response.response.substring(startIdx, endIdx + 1));

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// AI Exam/Quiz Generator
app.post("/api/generate-exam", async (c) => {
  try {
    const { topic, subjectName, difficulty, count } = await c.req.json();
    
    const prompt = `
      You are an expert South African teacher creating a multiple-choice exam.
      
      CONTEXT:
      - Subject: ${subjectName}
      - Topic: ${topic}
      - Difficulty/Grade Level: ${difficulty}
      - Total Questions: ${count}

      STRICT JSON SCHEMA (Array of Objects):
      [
        {
          "questionText": "Question string",
          "type": "MCQ",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The exact string of the correct option",
          "points": 1
        }
      ]

      RULES:
      1. Output ONLY raw JSON. No conversational text or markdown.
      2. Ensure correct answer matches one of the options exactly.
      3. Tailor questions to the specified difficulty/grade level.
    `;

    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048
    });

    // Clean JSON response (llama-3-instruct might add backticks or preamble)
    let content = response.response.trim();
    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
      console.error("AI response did not contain a JSON array:", content);
      return c.json({ 
        error: "AI failed to generate a valid JSON array.",
        rawResponse: content 
      }, 500);
    }

    content = content.substring(startIdx, endIdx + 1);
    
    try {
      return c.json({ questions: JSON.parse(content) });
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message, "Content:", content);
      return c.json({ 
        error: "Failed to parse AI response as JSON.",
        details: parseError.message,
        content 
      }, 500);
    }
  } catch (error: any) {
    console.error("Worker Error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// AI Timetable Generator
app.post("/api/generate-timetable", async (c) => {
  try {
    const { context, settings } = await c.req.json();
    
    const prompt = `
      You are a school scheduler. Generate a weekly timetable (Monday to Friday) as a JSON object.
      
      CONTEXT:
      - Class: ${context.className}
      - Hours: ${settings.startTime} to ${settings.endTime} (${settings.periods} periods/day).
      - Subjects: ${JSON.stringify(context.subjects)}
      - Teachers: ${JSON.stringify(context.teachers)}
      
      STRICT RULES:
      1. Assign a Teacher to every Subject period.
      2. Output ONLY raw JSON matching this schema:
         { "schedule": [ { "day": "Monday", "periods": [ { "subject": "ID", "teacher": "ID", "startTime": "HH:MM", "endTime": "HH:MM" } ] } ] }
      3. No conversational text or markdown.
    `;

    const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2560
    });

    let content = response.response.trim();
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      console.error("AI response did not contain a JSON object:", content);
      return c.json({ 
        error: "AI failed to generate a valid JSON timetable.",
        rawResponse: content 
      }, 500);
    }

    content = content.substring(startIdx, endIdx + 1);

    try {
      return c.json(JSON.parse(content));
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message, "Content:", content);
      return c.json({ 
        error: "Failed to parse AI response as JSON.",
        details: parseError.message,
        content 
      }, 500);
    }
  } catch (error: any) {
    console.error("Worker Error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
