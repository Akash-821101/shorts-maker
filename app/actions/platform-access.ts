"use server";

import { isPlatformAllowed } from "@/lib/plan-limits";

export async function checkPlatformAccess(platform: string) {
  try {
    const isAllowed = await isPlatformAllowed(platform);
    return { isAllowed };
  } catch (error) {
    return { isAllowed: false };
  }
}
