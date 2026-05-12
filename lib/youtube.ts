import { createAdminClient } from "@/lib/supabase/server";

export async function getYouTubeConnection(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("social_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", "youtube")
    .single();

  if (error || !data) return null;
  return data;
}

export async function refreshYouTubeToken(connectionId: string, refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to refresh YouTube token: ${data.error_description || data.error}`);
  }

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("social_connections")
    .update({
      access_token: data.access_token,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);

  if (updateError) {
    console.error("Error updating refreshed token in DB:", updateError);
  }

  return data.access_token;
}

export async function uploadToYouTube({
  accessToken,
  videoUrl,
  title,
  description,
}: {
  accessToken: string;
  videoUrl: string;
  title: string;
  description: string;
}) {
  // 1. Download video content
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) throw new Error("Failed to download video for YouTube upload");
  const videoBlob = await videoResponse.blob();

  // 2. Initialize resumable upload
  const metadata = {
    snippet: {
      title,
      description,
      categoryId: "22", // People & Blogs
    },
    status: {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false,
    },
  };

  const initResponse = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": videoBlob.size.toString(),
        "X-Upload-Content-Type": "video/*",
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!initResponse.ok) {
    const errorData = await initResponse.json();
    throw new Error(`Failed to initialize YouTube upload: ${errorData.error?.message || initResponse.statusText}`);
  }

  const uploadUrl = initResponse.headers.get("Location");
  if (!uploadUrl) throw new Error("No upload URL received from YouTube");

  // 3. Upload the actual video data
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/*",
    },
    body: videoBlob,
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json();
    throw new Error(`Failed to upload video data to YouTube: ${errorData.error?.message || uploadResponse.statusText}`);
  }

  const finalData = await uploadResponse.json();
  return finalData.id; // Returns the YouTube Video ID
}
