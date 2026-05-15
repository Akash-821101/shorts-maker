"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Background-safe credit fetcher
 */
export async function getCreditsByUserId(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(`Error fetching credits for user ${userId}:`, error);
    return 0;
  }

  return data?.credits || 0;
}

/**
 * Background-safe credit deduction
 */
export async function deductCreditsInternal(userId: string, amount: number, description: string) {
  const supabaseAdmin = createAdminClient();
  
  const { error: updateError } = await supabaseAdmin
    .rpc('decrement_credits', { user_id_param: userId, deduct_amount: amount });

  if (updateError) {
    if (updateError.message.includes('Insufficient credits') || updateError.details?.includes('Insufficient credits')) {
      throw new Error("Insufficient credits");
    }
    throw updateError;
  }

  const { error: logError } = await supabaseAdmin
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount: -amount,
      type: "generation",
      description: description
    });

  if (logError) console.error("Failed to log transaction:", logError);
  
  return true;
}

/**
 * Clerk-aware credit fetcher (for UI)
 */
export async function getUserCredits() {
  const user = await currentUser();
  if (!user) return 0;
  return getCreditsByUserId(user.id);
}

/**
 * UI-triggered credit deduction
 */
export async function deductCredits(amount: number, description: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  
  const result = await deductCreditsInternal(user.id, amount, description);
  revalidatePath("/dashboard");
  return result;
}

/**
 * Clerk-aware credit addition (for purchases/bonuses)
 */
export async function addCredits(amount: number, description: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
  
    const supabaseAdmin = createAdminClient();
  
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_credits', { user_id_param: user.id, add_amount: amount });
  
    if (updateError) throw updateError;
  
    const { error: logError } = await supabaseAdmin
      .from("credit_transactions")
      .insert({
        user_id: user.id,
        amount: amount,
        type: "purchase",
        description: description
      });
  
    if (logError) console.error("Failed to log transaction:", logError);
  
    revalidatePath("/dashboard");
    return true;
  }
