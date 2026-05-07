import { createAdminClient } from "@/lib/supabase/server";
import { VOICES } from "@/lib/data/voices";

export async function generateTTS(params: {
  text: string;
  voiceId: string;
  seriesId: string;
}) {
  const { text, voiceId, seriesId } = params;
  const voice = VOICES.find((v) => v.id === voiceId);

  if (!voice) {
    throw new Error(`Voice not found: ${voiceId}`);
  }

  let audioBuffer: Buffer;

  if (voice.model === "Deepgram") {
    audioBuffer = await generateDeepgramTTS(text, voice.id.replace("dg-", ""));
  } else if (voice.model === "Fondalab") {
    audioBuffer = await generateFonadaTTS(text, voice.name, voice.languageCode);
  } else {
    throw new Error(`Unsupported TTS model: ${voice.model}`);
  }

  // Upload to Supabase Storage
  const supabase = createAdminClient();
  const fileName = `${seriesId}/${Date.now()}.mp3`;

  const { data, error } = await supabase.storage
    .from("shorts")
    .upload(fileName, audioBuffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload audio to storage: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("shorts")
    .getPublicUrl(fileName);

  return { audioUrl: publicUrl };
}

async function generateDeepgramTTS(text: string, voiceName: string): Promise<Buffer> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("DEEPGRAM_API_KEY is missing");

  const model = `aura-${voiceName}-en`;
  console.log(`Deepgram TTS: Requesting model ${model}`);

  const response = await fetch(`https://api.deepgram.com/v1/speak?model=${model}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Deepgram TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateFonadaTTS(text: string, voiceName: string, language: string): Promise<Buffer> {
  const apiKey = process.env.FONADA_API_KEY;
  if (!apiKey) throw new Error("FONADA_API_KEY is missing");

  // Map language code to Fonada language names if necessary
  const langMap: Record<string, string> = {
    "hi-IN": "Hindi",
    "en-US": "English",
    "en-UK": "English",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
  };

  const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      voice: voiceName,
      language: langMap[language] || "English",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fonadalabs TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
