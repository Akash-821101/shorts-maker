import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not defined in environment variables");
  return new GoogleGenerativeAI(key);
}

export async function generateVideoScript(params: {
  niche: string;
  title: string;
  duration: string;
  style: string;
  language?: string;
}) {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const { niche, title, duration, style, language = "English" } = params;
  
  // Determine number of image prompts based on duration
  // User asked: 4-5 for 30-40s, 5-6 for 50-60s
  let promptCount = 4;
  if (duration.includes("30") || duration.includes("40")) {
    promptCount = 5;
  } else if (duration.includes("50") || duration.includes("60")) {
    promptCount = 6;
  }

  const prompt = `
    You are a professional video script writer for short-form content (TikTok, Reels, Shorts).
    Generate a natural, engaging video script and matching image prompts for the following:
    - Series Topic: ${title}
    - Niche: ${niche}
    - Target Duration: ${duration}
    - Visual Style: ${style}
    - Language: ${language}

    Requirements:
    1. The "title" field in your JSON response must be a unique, catchy, and specific title for this particular video script (do not just reuse the series name).
    2. The narration script MUST BE written entirely in ${language}. It must be natural for a voiceover (clear, conversational, no complex jargon).
    3. Divide the script into exactly ${promptCount} scenes.
    4. For each scene, provide a detailed visual image prompt matching the "${style}" style and the corresponding narration text.
    5. Return the response in strict JSON format.

    JSON Schema:
    {
      "title": "A unique catchy title for this specific video instance",
      "narration": "The full text for the entire voiceover",
      "scenes": [
        {
          "sceneId": 1,
          "imagePrompt": "Detailed visual description of the scene",
          "text": "The narration text for this specific scene"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
