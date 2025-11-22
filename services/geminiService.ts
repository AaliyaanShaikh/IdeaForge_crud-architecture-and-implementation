import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const apiKey = process.env.API_KEY;
// Initialize lazily to ensure environment variables are ready, though in this setup they are injected globally.
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_TYPES' });

const SYSTEM_INSTRUCTION = `
You are an intelligent assistant for an "Idea Management" application.
Your goal is to help users flesh out brief idea titles into robust descriptions and suggest relevant tags.
Keep descriptions concise but inspiring (under 100 words).
Generate 3-5 relevant, single-word tags.
`;

export const enhanceIdeaWithAI = async (title: string): Promise<AIResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment.");
  }

  const model = "gemini-2.5-flash";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a description and tags for an idea titled: "${title}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
