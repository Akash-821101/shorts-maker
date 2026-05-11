"use server";

import { checkPlanLimits } from "@/lib/plan-limits";

export async function canCreateSeries() {
  try {
    const limits = await checkPlanLimits();
    return limits;
  } catch (error) {
    return { canCreate: false, limitReached: true, plan: "free" };
  }
}
