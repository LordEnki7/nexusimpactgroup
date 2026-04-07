import OpenAI from "openai";

// Prefer Replit-managed AI integration key — falls back to direct OPENAI_API_KEY
const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

if (!apiKey) {
  console.warn("[OpenAI] No API key found. Set OPENAI_API_KEY or connect the Replit OpenAI integration.");
} else {
  const source = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ? "Replit AI Integration" : "OPENAI_API_KEY env var";
  console.log(`[OpenAI] Using key from: ${source}`);
}

export const openai = new OpenAI({
  apiKey,
  ...(baseURL ? { baseURL } : {}),
});
