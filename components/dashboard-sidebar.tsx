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
import { useUser, Show, useAuth } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Plus,
  Zap,
  PanelLeftClose,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateSeriesButton } from "@/components/shared/create-series-button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { name: "Series", href: "/dashboard", icon: LayoutDashboard },
  { name: "Videos", href: "/dashboard/videos", icon: Video },
  { name: "Guides", href: "/dashboard/guides", icon: BookOpen },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user } = useUser();
  const { has, isLoaded } = useAuth();

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
        </div>
        <div className="px-2 mt-4">
          <CreateSeriesButton
            label="Create New Series"
            className="w-full justify-start"
            size="lg"
          />
        </div>
      </SidebarHeader>

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
          <div className="flex items-center gap-3 px-2 py-2 bg-accent/50 hover:bg-accent/80 transition-colors cursor-pointer rounded-xl overflow-hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
              {user?.imageUrl ? (
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{user?.firstName?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium leading-none truncate">{user?.fullName || "My Profile"}</span>
                <Show when={isLoaded && (has as any)({ entitlement: "pro" })}>
                  <Badge className="bg-primary/20 text-primary border-primary/20 px-1 py-0 h-4 text-[8px] font-black uppercase tracking-tighter">
                    Pro
                  </Badge>
                </Show>
              </div>
              <span className="text-xs text-muted-foreground mt-1 truncate">{user?.primaryEmailAddress?.emailAddress || "Manage Account"}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


