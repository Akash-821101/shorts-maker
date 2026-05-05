import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/app/actions/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Use the Server Action to sync the user to Supabase
  await syncUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* We can add a dashboard sidebar or header here in the future */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
