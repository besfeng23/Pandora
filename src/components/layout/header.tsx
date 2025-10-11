
"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Circle, Download, LifeBuoy, LogOut, PanelLeft, RefreshCw, Settings, User } from 'lucide-react';
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
import { useCommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useUser } from '@/firebase';

const notifications = [
    { title: "New critical alert on 'Auth Service'", timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false, status: 'destructive' as const },
    { title: "Key rotation successful for 'GitHub'", timestamp: new Date(Date.now() - 30 * 60 * 1000), read: false, status: 'success' as const },
    { title: "Maintenance window starting in 1 hour", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true, status: 'warning' as const },
    { title: "Deployment of 'Billing API' complete", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), read: true, status: 'neutral' as const },
];

const AuditActions: React.FC<{ onRefresh?: () => void; onExport?: () => void; }> = ({ onRefresh, onExport }) => (
    <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw /> Refresh</Button>
        <Button size="sm" onClick={onExport}><Download /> Export CSV</Button>
    </div>
);

const pageDetails: { [key: string]: { title: string; description: string; actions?: React.FC<any> } } = {
  '/': { title: 'Dashboard', description: 'A high-level overview of your system.' },
  '/services': { title: 'Services', description: 'Manage and monitor your service integrations.' },
  '/incidents': { title: 'Incidents', description: 'Track and manage incidents across your services.' },
  '/audit': { title: 'Audit', description: 'Immutable event trail across services', actions: AuditActions },
  '/search': { title: 'Search', description: 'Search across all services, logs, and events.' },
  '/connections': { title: 'Connections', description: 'Manage and monitor your service integrations.' },
  '/settings': { title: 'Settings', description: 'Manage your system configuration and integrations.' },
  '/profile': { title: 'User Profile', description: 'View and manage your profile details.'},
  '/support': { title: 'Support', description: 'Get help and find answers.'},
  '/billing': { title: 'Billing & Usage', description: 'Track your cloud spend and resource usage.' },
  '/runbooks': { title: 'Runbooks', description: 'Create and execute step-by-step operational procedures.' },
  '/login': { title: 'Login', description: 'Sign in to your account.' },
  '/register': { title: 'Register', description: 'Create an account.' },
  '/cost-optimization': { title: 'Cost Optimization', description: 'Use AI to find savings.'},
  '/code-review': { title: 'Code Review', description: 'Use AI to improve code quality.'},
  '/maintenance': { title: 'Predictive Maintenance', description: 'Use AI to predict failures.'},
  '/actions': { title: 'Actions', description: 'Execute tools and scripts.'},
};

function getDetailsFromPathname(pathname: string) {
    if (pathname.startsWith('/services/')) return { title: 'Service Detail', description: 'Detailed view of a specific service.' };
    if (pathname.startsWith('/settings/')) return pageDetails['/settings'];
    return pageDetails[pathname] || { title: 'Pandora', description: 'Your all-in-one system management and operations platform.'};
}

// A simple event emitter
class EventEmitter {
    private listeners: { [event: string]: Function[] } = {};
    on(event: string, listener: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(listener);
    }
    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener(...args));
    }
}
export const headerActions = new EventEmitter();


export default function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { setOpen } = useCommandPalette();
  const details = getDetailsFromPathname(pathname);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [refreshFunc, setRefreshFunc] = React.useState<(() => void) | undefined>(() => undefined);
  const [exportFunc, setExportFunc] = React.useState<(() => void) | undefined>(() => undefined);

  React.useEffect(() => {
    const onRefresh = (handler: () => void) => setRefreshFunc(() => handler);
    const onExport = (handler: () => void) => setExportFunc(() => handler);
    headerActions.on('refresh', onRefresh);
    headerActions.on('export', onExport);
  }, []);

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

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (pathname === '/login' || pathname === '/register') {
    return null; // Don't render header on auth pages
  }

  const PageActions = details.actions;

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
      
      {PageActions && <PageActions onRefresh={refreshFunc} onExport={exportFunc} />}

      <div className="flex items-center justify-end gap-2">
        <ThemeToggle />
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5"/>
                    {notifications.some(n => !n.read) && (
                        <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n, i) => (
                     <DropdownMenuItem key={i} className="flex items-start gap-3">
                        {!n.read && <Circle className="h-2 w-2 fill-primary text-primary mt-1.5" />}
                        <div className={cn("flex-grow", n.read && "ml-5")}>
                            <p className="text-sm">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                    {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt="User Avatar" />
                    ) : (
                        <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                    )}
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'Pandora User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <Link href="/profile">
                    <User />
                    <span>Profile</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link href="/support">
                    <LifeBuoy />
                    <span>Support</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
        )}
      </div>
    </header>
  );
}

    