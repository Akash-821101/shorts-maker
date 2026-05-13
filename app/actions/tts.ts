"use server";

import { generateTTS } from "@/lib/tts";
import { VOICES, SAMPLE_VOICE_ENGLISH, SAMPLE_VOICE_HINDI } from "@/lib/data/voices";

export async function getVoicePreviewAction(voiceId: string) {
  try {
    const voice = VOICES.find((v) => v.id === voiceId);
    if (!voice) {
      throw new Error("Voice not found");
    }

    const text = voice.languageCode.startsWith("hi") ? SAMPLE_VOICE_HINDI : SAMPLE_VOICE_ENGLISH;
    const customFileName = `audio_previews/${voiceId}.mp3`;

    const { audioUrl } = await generateTTS({
      text,
      voiceId,
      customFileName
    });

    return { success: true, audioUrl };
  } catch (error: any) {
    console.error("Error generating voice preview:", error);
    return { success: false, error: error.message };
  }
}