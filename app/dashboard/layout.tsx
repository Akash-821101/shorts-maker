import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/app/actions/user";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserButton } from "@clerk/nextjs";
import { CreditIndicator } from "@/components/dashboard/credit-indicator";

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
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen bg-background w-full">
          <DashboardSidebar />
          <SidebarInset className="flex-1 flex flex-col w-full overflow-hidden">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-2 cursor-pointer md:hidden" />
              </div>
              <div className="flex items-center gap-4">
                <CreditIndicator />
                <UserButton />
              </div>
            </header>
            <main className="flex-1 p-6 md:p-8 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
