"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Plus,
  Zap,
  PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog";
import { canCreateSeries } from "@/app/actions/limits";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { name: "Series", href: "/dashboard", icon: LayoutDashboard },
  { name: "Videos", href: "/dashboard/videos", icon: Video },
  { name: "Guides", href: "/dashboard/guides", icon: BookOpen },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { user } = useUser();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  const handleCreateNew = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCheckingLimit(true);
    try {
      const { canCreate } = await canCreateSeries();
      if (canCreate) {
        router.push("/dashboard/create");
      } else {
        setShowUpgradeDialog(true);
      }
    } catch (error) {
      toast.error("Failed to check plan limits");
    } finally {
      setIsCheckingLimit(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <Link href="/" className="font-bold text-lg tracking-tight cursor-pointer">Shorts Maker</Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="w-5 h-5" />
          </Button>
        </div>
        <div className="px-2 mt-4">
          <Button 
            className="w-full justify-start gap-2 shadow-md font-bold rounded-xl cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300" 
            size="lg" 
            onClick={handleCreateNew}
            disabled={isCheckingLimit}
          >
            {isCheckingLimit ? (
              <Zap className="w-5 h-5 animate-pulse" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Create New Series
          </Button>
        </div>
      </SidebarHeader>

      <UpgradeDialog 
        isOpen={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog} 
        title="Series Limit Reached"
        description="You've reached the maximum number of series for your current plan. Upgrade to Unlimited for endless possibilities."
      />

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className="h-10 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full gap-2 shadow-sm font-medium rounded-xl cursor-pointer" asChild>
            <Link href="/dashboard/billing">
              <Zap className="w-4 h-4 text-primary" />
              Upgrade Plan
            </Link>
          </Button>
          <div className="flex items-center gap-3 px-2 py-2 bg-accent/50 hover:bg-accent/80 transition-colors cursor-pointer rounded-xl">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
              {user?.imageUrl ? (
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{user?.firstName?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium leading-none truncate">{user?.fullName || "My Profile"}</span>
              <span className="text-xs text-muted-foreground mt-1 truncate">{user?.primaryEmailAddress?.emailAddress || "Manage Account"}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
