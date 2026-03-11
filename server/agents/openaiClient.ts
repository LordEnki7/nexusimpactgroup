import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

if (!apiKey) {
  console.warn("[OpenAI] No API key found. Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY.");
}

export const openai = new OpenAI({
  apiKey,
  ...(baseURL ? { baseURL } : {}),
});
