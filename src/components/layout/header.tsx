"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Bell, PanelLeft, LogOut, User, Settings, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSidebar } from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function getTitleFromPathname(pathname: string) {
    if (pathname === '/') return 'Dashboard';
    const title = pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Dashboard';
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const title = getTitleFromPathname(pathname);
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold md:text-2xl">{title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services, connections, users, settings..." 
            className="pl-10 rounded-xl"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
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
