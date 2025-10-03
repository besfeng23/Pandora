"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Star,
  Zap,
  Home,
  Network,
  Search,
  Cog,
  ChevronsRightLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/settings", label: "System", icon: Settings },
  { href: "/search", label: "Search", icon: Search },
  { href: "/connections", label: "Connections", icon: Network },
];

const globalSettingsItem = { href: "/global-settings", label: "Global Settings", icon: Cog };
const quickActionsItem = { href: "/actions", label: "Quick Actions", icon: ChevronsRightLeft };


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" className="w-[72px] rounded-2xl m-2 border-none -mr-[72px] shadow-none">
      <SidebarContent className="justify-center">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="rounded-xl"
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5"/>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="justify-center">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === globalSettingsItem.href}
              className="rounded-xl"
              tooltip={globalSettingsItem.label}
            >
              <Link href={globalSettingsItem.href}>
                <globalSettingsItem.icon className="w-5 h-5"/>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === quickActionsItem.href}
              className="rounded-xl"
              tooltip={quickActionsItem.label}
            >
              <Link href={quickActionsItem.href}>
                <quickActionsItem.icon className="w-5 h-5"/>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
