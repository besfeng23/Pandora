
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Search,
  Network,
  ChevronsRightLeft,
  FileText,
  LayoutGrid,
  HeartPulse,
  Code,
  DollarSign
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/services", label: "Services", icon: LayoutGrid },
  { href: "/audit", label: "Audit Log", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
  { href: "/connections", label: "Connections", icon: Network },
];

const bottomNavItems = [
    { href: "/maintenance", label: "Maintenance", icon: HeartPulse },
    { href: "/code-review", label: "Code Review", icon: Code },
    { href: "/cost-optimization", label: "Cost", icon: DollarSign },
    { href: "/actions", label: "Quick Actions", icon: ChevronsRightLeft },
    { href: "/settings", label: "Settings", icon: Settings },
];


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" className="w-[72px] rounded-2xl m-2 border-none -mr-[72px] shadow-none bg-card">
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
           {bottomNavItems.map((item) => (
             <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
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
      </SidebarFooter>
    </Sidebar>
  );
}
