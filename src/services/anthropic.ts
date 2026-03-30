import { Difficulty } from "../types";

export interface GeneratedCard {
  front: string;
  back: string;
  difficulty: Difficulty;
}

export async function generateFlashcards(content: string, apiKey: string): Promise<GeneratedCard[]> {
  const prompt = `Analyze this study content and generate 10-15 flashcards. Return ONLY a valid JSON array with no additional text, markdown, or explanation. Each flashcard must have: front (question), back (answer), difficulty (easy/medium/hard).
Format:
[{"front":"Question?","back":"Answer","difficulty":"medium"}]
Content:
${content}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "dangerously-allow-browser": "true", // Required for client-side Anthropic calls
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620", // Using a valid model name
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate flashcards");
  }

  const data = await response.json();
  const text = data.content[0].text;
  
  try {
    // Attempt to parse JSON from the response text
    const jsonMatch = text.match(/\[.*\]/s);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI returned invalid JSON format");
  }
}
