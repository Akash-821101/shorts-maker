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
import { useUser, Show, useAuth, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Zap,
  PanelLeftClose,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateSeriesButton } from "@/components/shared/create-series-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/shared/logo";

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
  const { openUserProfile, signOut } = useClerk();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between px-2 pt-2">
          <Logo size="md" />
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="w-5 h-5" />
          </Button> */}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 px-2 py-2 bg-accent/50 hover:bg-accent/80 transition-colors cursor-pointer rounded-xl overflow-hidden">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
                  {user?.imageUrl ? (
                    <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-primary">{user?.firstName?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                  <span className="text-sm font-medium leading-none truncate">{user?.fullName || "My Profile"}</span>
                  <span className="text-xs text-muted-foreground mt-1 truncate">
                    {isLoaded ? ((has as any)({ entitlement: "pro" }) ? "Pro Plan" : "Free Plan") : "Loading..."}
                  </span>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end" side="right" sideOffset={12}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => openUserProfile()} className="cursor-pointer rounded-lg">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Manage Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link href="/dashboard/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
