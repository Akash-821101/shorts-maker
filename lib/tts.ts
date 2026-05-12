import { createAdminClient } from "@/lib/supabase/server";
import { VOICES } from "@/lib/data/voices";

export async function generateTTS(params: {
  text: string;
  voiceId: string;
  seriesId?: string;
  fileName?: string;
}) {
  const { text, voiceId, seriesId, fileName: customFileName } = params;
  const voice = VOICES.find((v) => v.id === voiceId);

  if (!voice) {
    throw new Error(`Voice not found: ${voiceId}`);
  }

  const supabase = createAdminClient();
  const fileName = customFileName || `${seriesId}/${Date.now()}.mp3`;

  // Check if file already exists in storage to save API costs
  const { data: existingFiles } = await supabase.storage
    .from("shorts")
    .list(fileName.includes('/') ? fileName.split('/')[0] : "", {
      search: fileName.includes('/') ? fileName.split('/').pop() : fileName,
    });

  if (existingFiles && existingFiles.length > 0) {
    const { data: { publicUrl } } = supabase.storage
      .from("shorts")
      .getPublicUrl(fileName);
    return { audioUrl: publicUrl };
  }

  let audioBuffer: Buffer;

  if (voice.model === "Deepgram") {
    audioBuffer = await generateDeepgramTTS(text, voice.id.replace("aura-2-", "").replace("-en", ""));
  } else if (voice.model === "Fondalab") {
    audioBuffer = await generateFonadaTTS(text, voice.name, voice.languageCode);
  } else {
    throw new Error(`Unsupported TTS model: ${voice.model}`);
  }

  // Upload to Supabase Storage
  const { error } = await supabase.storage
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

async function generateFonadaTTS(text: string, voiceName: string, languageCode: string): Promise<Buffer> {
  const apiKey = process.env.FONADA_API_KEY;
  if (!apiKey) throw new Error("FONADA_API_KEY is missing");

  // Map language code to Fonada allowed language names: "Hindi", "Tamil", "Telugu", "English"
  const langMap: Record<string, string> = {
    "hi-IN": "Hindi",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "en-US": "English",
    "en-UK": "English",
    "en-GB": "English",
  };

  const fonadaLanguage = langMap[languageCode] || "English";

  console.log(`Fonada TTS: Requesting voice=${voiceName}, language=${fonadaLanguage}`);

  const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      voice: voiceName,
      language: fonadaLanguage,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fonada API Error:", errorText);
    throw new Error(`Fonada TTS Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
