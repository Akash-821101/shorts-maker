import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectSocialAccount } from "@/app/actions/settings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=google_oauth_failed", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings", request.url));
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // 1. Exchange code for tokens
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens");
    }

    // 2. Fetch user info to get the channel name/id
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userResponse.json();

    // 3. Save to database
    await connectSocialAccount("youtube", {
      platform_user_id: userInfo.id,
      platform_username: userInfo.name || userInfo.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    return NextResponse.redirect(new URL("/dashboard/settings?success=youtube_connected", request.url));
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=callback_error", request.url));
  }
}
