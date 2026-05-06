export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

export interface CaptionResult {
  transcript: string;
  words: Word[];
}

/**
 * Generates captions (transcription) for an audio file using Deepgram.
 * 
 * @param params - Object containing the audio URL and series ID.
 * @returns An object containing the full transcript and word-level timestamps.
 */
export async function generateCaptions(params: {
  audioUrl: string;
  seriesId: string;
}): Promise<CaptionResult> {
  const { audioUrl, seriesId } = params;
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is missing from environment variables");
  }

  console.log(`[Captions] Starting transcription for series ${seriesId}: ${audioUrl}`);

  try {
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: audioUrl }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Captions] Deepgram API Error: ${response.status}`, errorText);
      throw new Error(`Deepgram Transcription Error: ${errorText}`);
    }

    const data = await response.json();
    const alternative = data.results?.channels?.[0]?.alternatives?.[0];

    if (!alternative) {
      console.error("[Captions] No transcription alternatives found in response", data);
      throw new Error("No transcription results found from Deepgram");
    }

    const result: CaptionResult = {
      transcript: alternative.transcript,
      words: alternative.words.map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        confidence: w.confidence,
        punctuated_word: w.punctuated_word,
      })),
    };

    console.log(`[Captions] Successfully generated ${result.words.length} words for series ${seriesId}`);

    return result;
  } catch (error) {
    console.error("[Captions] Exception during caption generation:", error);
    throw error;
  }
}
