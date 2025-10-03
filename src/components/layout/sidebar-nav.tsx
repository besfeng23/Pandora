"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HardDrive,
  FileText,
  Settings,
  Star,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: HardDrive },
  { href: "/audit", label: "Audit Log", icon: FileText },
];

const settingsNavItem = { href: "/settings", label: "Settings", icon: Settings };

const favorites = [
    { label: "Restart Pods", icon: Zap },
    { label: "Scale Workers", icon: Zap },
    { label: "Flush CDN", icon: Zap },
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src="https://picsum.photos/seed/logo/100/100" alt="Pandora Logo" data-ai-hint="abstract logo" />
            <AvatarFallback className="rounded-lg">P</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-semibold">Pandora</span>
            <span className="text-sm text-muted-foreground">Workspace</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="rounded-xl"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
                <Star className="size-4"/>
                <span>Favorites</span>
            </SidebarGroupLabel>
            <SidebarMenu>
                {favorites.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        className="rounded-xl"
                    >
                        <Link href="#">
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === settingsNavItem.href}
              className="rounded-xl"
            >
              <Link href={settingsNavItem.href}>
                <settingsNavItem.icon />
                <span>{settingsNavItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
