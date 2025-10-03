"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Bell, PanelLeft, LogOut, User, Settings, LifeBuoy, ChevronDown } from 'lucide-react';
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

function getTitleFromPathname(pathname: string) {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/services')) return 'Services';
    const title = pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Dashboard';
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { setOpen } = useCommandPalette();
  const title = getTitleFromPathname(pathname);
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1">
        <h1 className="font-semibold text-xl hidden sm:block">{title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-center gap-4">
        <Button variant="outline" className="w-full max-w-[520px] justify-start text-muted-foreground rounded-lg" onClick={() => setOpen(true)}>
          <Search className="h-5 w-5 mr-2" />
          <span className="hidden lg:inline-flex">Search or run a command...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none ml-auto hidden h-6 select-none items-center gap-1 rounded border bg-surface-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
            <span className="text-base">⌘</span>/
          </kbd>
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2 flex-1">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-lg">
                    <span>Env:</span>
                    <span className="font-semibold">Dev</span>
                    <ChevronDown className="h-4 w-4 text-text-subtle" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem>Development</DropdownMenuItem>
                <DropdownMenuItem>Staging</DropdownMenuItem>
                <DropdownMenuItem>Production</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Manage environments</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

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
