
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Bell, PanelLeft, LogOut, User, Settings, LifeBuoy, ChevronDown, RefreshCw, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';

const pageDetails: { [key: string]: { title: string; description: string; actions?: React.FC<{ onRefresh?: () => void; onExport?: () => void; }> } } = {
  '/': { title: 'Dashboard', description: 'A high-level overview of your system.' },
  '/services': { title: 'Services', description: 'Integrate providers across auth, data, storage, payments, and more.' },
  '/audit': { 
    title: 'Audit', 
    description: 'Immutable event trail across services',
    actions: ({ onRefresh, onExport }) => (
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    )
  },
  '/search': { title: 'Search', description: 'Search across all services, logs, and events.' },
  '/connections': { title: 'Connections', description: 'Manage and monitor your service integrations.' },
  '/settings': { title: 'Settings', description: 'Manage your system configuration and integrations.' },
};

function getDetailsFromPathname(pathname: string) {
    if (pathname.startsWith('/services/')) return { title: 'Service Detail', description: 'Detailed view of a specific service.' };
    if (pathname.startsWith('/settings/')) return pageDetails['/settings'];
    return pageDetails[pathname] || { title: 'Pandora', description: 'Your all-in-one system management and operations platform.'};
}

export default function Header({ onRefresh, onExport }: { onRefresh?: () => void; onExport?: () => void; }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { setOpen } = useCommandPalette();
  const details = getDetailsFromPathname(pathname);
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  return (
    <header className="sticky top-0 z-30 flex h-auto items-center gap-4 border-b bg-background/80 p-4 backdrop-blur-sm sm:px-6 sm:py-4">
      <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={toggleSidebar}>
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1">
        <h1 className="font-semibold text-lg">{details.title}</h1>
        <p className="text-xs text-muted-foreground">{details.description}</p>
      </div>
      
      {details.actions && details.actions({ onRefresh, onExport })}

      <div className="flex items-center justify-end gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {userAvatar && (
                  <AvatarImage 
                    src={userAvatar.imageUrl} 
                    alt="User Avatar"
                    width={100}
                    height={100}
                    data-ai-hint={userAvatar.imageHint} 
                  />
                )}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Pandora User</p>
                    <p className="text-xs leading-none text-muted-foreground">user@pandora.dev</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
