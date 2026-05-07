import Replicate from "replicate";
import { createAdminClient } from "@/lib/supabase/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface ImageResult {
  images: { sceneId: number; url: string }[];
}

/**
 * Generates images for video scenes using the SDXL Lightning model.
 * Each image is uploaded to Supabase Storage.
 * 
 * @param params - Object containing scenes with prompts, seriesId for storage path, and visual style.
 * @returns An object containing an array of public image URLs.
 */
export async function generateImages(params: {
  scenes: { sceneId: number; imagePrompt: string }[];
  seriesId: string;
  styleId: string;
}): Promise<ImageResult> {
  const { scenes, seriesId } = params;
  const images: { sceneId: number; url: string }[] = [];
  const supabase = createAdminClient();

  console.log(`[Images] Generating ${scenes.length} images for series ${seriesId}`);

  for (const scene of scenes) {
    try {
      console.log(`[Images] Generating image for scene ${scene.sceneId}...`);
      
      const input = {
        prompt: scene.imagePrompt,
        width: 720,
        height: 1280,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 4,
        guidance_scale: 0
      };

      let output: any;
      let retries = 5;

      while (retries > 0) {
        try {
          output = await replicate.run(
            "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
            { input }
          );
          break; // Success!
        } catch (error: any) {
          const isRateLimit = error.status === 429 || error.message?.includes("429");
          if (isRateLimit && retries > 1) {
            const waitTime = error.retry_after || 5;
            console.warn(`[Images] Rate limited. Waiting ${waitTime}s...`);
            await new Promise(r => setTimeout(r, waitTime * 1000));
            retries--;
          } else {
            throw error;
          }
        }
      }

      if (!output?.[0]) throw new Error(`No output for scene ${scene.sceneId}`);

      const imageUrl = typeof output[0].url === 'function' ? output[0].url() : output[0];

      // 2. Download from Replicate
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();

      // 3. Upload to Supabase Storage
      const fileName = `${seriesId}/scene-${scene.sceneId}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("shorts")
        .upload(fileName, Buffer.from(arrayBuffer), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw new Error(`Supabase Upload Error: ${uploadError.message}`);

      // 4. Collect public URL
      const { data: { publicUrl } } = supabase.storage.from("shorts").getPublicUrl(fileName);
      images.push({ sceneId: scene.sceneId, url: publicUrl });
      
      console.log(`[Images] Scene ${scene.sceneId} complete: ${publicUrl}`);

      // Small delay between scenes to help with burst limits
      await new Promise(r => setTimeout(r, 2000));

    } catch (error) {
      console.error(`[Images] Error in scene ${scene.sceneId}:`, error);
      throw error;
    }
  }

  return { images };
}
