import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";

export type PlanType = "free" | "basics" | "unlimited";

export interface PlanLimits {
  maxSeries: number;
  allowedPlatforms: string[];
}

export const PLAN_CONFIG: Record<PlanType, PlanLimits> = {
  free: {
    maxSeries: 1,
    allowedPlatforms: ["youtube", "email"],
  },
  basics: {
    maxSeries: 3,
    allowedPlatforms: ["youtube", "email"],
  },
  unlimited: {
    maxSeries: Infinity,
    allowedPlatforms: ["youtube", "email", "instagram", "tiktok"],
  },
};

export async function getUserPlan(): Promise<PlanType> {
  const user = await currentUser();
  if (!user) return "free";

  // Check Clerk public metadata for plan
  // Fallback to "free" if not set
  const plan = (user.publicMetadata.plan as PlanType) || "free";
  return plan;
}

export async function checkPlanLimits() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const plan = await getUserPlan();
  const limits = PLAN_CONFIG[plan];

  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("series")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error checking series count:", error);
    return { canCreate: false, limitReached: true, plan };
  }

  const currentCount = count || 0;
  return {
    canCreate: currentCount < limits.maxSeries,
    currentCount,
    maxSeries: limits.maxSeries,
    plan,
    limitReached: currentCount >= limits.maxSeries
  };
}

export async function isPlatformAllowed(platform: string) {
  const plan = await getUserPlan();
  const limits = PLAN_CONFIG[plan];
  return limits.allowedPlatforms.includes(platform);
}
