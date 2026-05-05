"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  // Initialize Supabase admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  const user_id = user.id

  // Upsert the user into the Supabase database
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        email: primaryEmail,
        name: fullName,
        user_id: user_id,

      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error syncing user to Supabase:", error);
    return null;
  }

  return data;
}
