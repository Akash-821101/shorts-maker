"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getSocialConnections() {
  const user = await currentUser();
  if (!user) return [];

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("social_connections")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching social connections:", error);
    return [];
  }

  return data;
}

export async function connectSocialAccount(platform: "youtube" | "instagram" | "tiktok", platformData: any) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from("social_connections")
    .upsert(
      {
        user_id: user.id,
        platform,
        ...platformData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, platform" }
    );

  if (error) {
    console.error(`Error connecting to ${platform}:`, error);
    throw new Error(`Failed to connect ${platform}`);
  }

  revalidatePath("/dashboard/settings");
}

export async function disconnectSocialAccount(platform: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from("social_connections")
    .delete()
    .match({ user_id: user.id, platform });

  if (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    throw new Error(`Failed to disconnect ${platform}`);
  }

  revalidatePath("/dashboard/settings");
}

export async function deleteUserAccount() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const supabaseAdmin = createAdminClient();
  const client = await clerkClient();

  // 1. Delete from Supabase (RLS should handle cascade if configured, but let's be explicit)
  const { error: supabaseError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("user_id", user.id);

  if (supabaseError) {
    console.error("Error deleting user from Supabase:", supabaseError);
    throw new Error("Failed to delete user data from database");
  }

  // 2. Delete from Clerk
  try {
    await client.users.deleteUser(user.id);
  } catch (error) {
    console.error("Error deleting user from Clerk:", error);
    throw new Error("Failed to delete user account");
  }

  // 3. Redirect to home page
  redirect("/");
}

// Simulated connection flow for Instagram/TikTok
export async function simulateConnect(platform: "instagram" | "tiktok") {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Mock data
  const mockData = {
    platform_user_id: `mock_${platform}_${Math.random().toString(36).substring(7)}`,
    platform_username: `${user.firstName?.toLowerCase() || 'user'}_on_${platform}`,
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  };

  return connectSocialAccount(platform, mockData);
}

// YouTube/Google OAuth setup (Redirect implementation)
export async function getYouTubeAuthUrl() {
  // In a real scenario, you'd use the Google Auth library to generate this URL
  // using process.env.GOOGLE_CLIENT_ID and redirect_uri.
  // For now, we simulate the redirection to the OAuth page.
  
  // This is a placeholder for the actual OAuth URL generation
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;
  const scope = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly";
  
  if (!clientId) {
    console.warn("GOOGLE_CLIENT_ID is not set. Using simulated YouTube connection.");
    return null;
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  
  return url;
}
