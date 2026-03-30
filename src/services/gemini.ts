import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

export interface GeneratedCard {
  front: string;
  back: string;
  difficulty: Difficulty;
}

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateFlashcardsWithGemini(content: string): Promise<GeneratedCard[]> {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this study content and generate 10-15 flashcards. Each flashcard must have: front (question), back (answer), difficulty (easy/medium/hard).
Content:
${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: {
              type: Type.STRING,
              description: "The question or prompt on the front of the card.",
            },
            back: {
              type: Type.STRING,
              description: "The answer or explanation on the back of the card.",
            },
            difficulty: {
              type: Type.STRING,
              enum: ["easy", "medium", "hard"],
              description: "The perceived difficulty of the card.",
            },
          },
          required: ["front", "back", "difficulty"],
        },
      },
    },
  });

  const text = response.text;
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("AI returned invalid JSON format");
  }
}
