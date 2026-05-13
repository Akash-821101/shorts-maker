import { currentUser, auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { PRICING_PLANS, PlanTier } from "./data/plans";

export type PlanType = PlanTier;

export interface PlanLimits {
  maxSeries: number;
  allowedPlatforms: string[];
}

export const PLAN_CONFIG: Record<PlanType, PlanLimits> = {
  free: {
    maxSeries: PRICING_PLANS.find(p => p.id === "free")?.seriesSlots || 1,
    allowedPlatforms: ["youtube", "email"],
  },
  starter: {
    maxSeries: PRICING_PLANS.find(p => p.id === "starter")?.seriesSlots || 3,
    allowedPlatforms: ["youtube", "email", "instagram", "tiktok"],
  },
  pro: {
    maxSeries: PRICING_PLANS.find(p => p.id === "pro")?.seriesSlots || 10,
    allowedPlatforms: ["youtube", "email", "instagram", "tiktok"],
  },
};

export async function getUserPlan(): Promise<PlanType> {
  const { has } = await auth();
  const user = await currentUser();
  if (!user) return "free";

  // Check Clerk Billing Entitlements (Recommended)
  // Priority: Pro > Starter > Free
  // Using 'as any' to bypass type errors for Clerk Billing entitlements
  if ((has as any)({ entitlement: "pro" })) return "pro";
  if ((has as any)({ entitlement: "starter" })) return "starter";
  if ((has as any)({ entitlement: "free" })) return "free";

  // Fallback to Clerk public metadata if entitlements are not set
  const plan = (user.publicMetadata.plan as PlanType) || "free";
  
  // Migration: if old plan names are found, map them
  if (plan as any === "basics") return "starter";
  if (plan as any === "unlimited") return "pro";

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
