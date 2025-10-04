
"use client";

import {
  Bell,
  Code,
  CreditCard,
  Database,
  GitBranch,
  Globe,
  LifeBuoy,
  Lock,
  Settings,
  User,
  Users,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/settings", label: "Overview", icon: Settings },
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/bridge", label: "Bridge", icon: GitBranch },
  { href: "/settings/integrations", label: "Integrations", icon: Globe },
  { href: "/settings/secrets", label: "Secrets", icon: Lock },
  { href: "/settings/connections", label: "Connections", icon: Database },
  { href: "/settings/access", label: "Access", icon: Users },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/api", label: "API", icon: Code },
  { href: "/settings/support", label: "Support", icon: LifeBuoy },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
