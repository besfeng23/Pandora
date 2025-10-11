
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Star,
  Zap,
  Search,
  Network,
  LayoutGrid
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { ServiceIcon } from "@/components/services/service-icon"
import { create } from 'zustand'
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import type { Service } from "@/lib/data-types"

type State = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCommandPalette = create<State>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export function CommandPalette() {
  const router = useRouter()
  const { open, setOpen } = useCommandPalette();
  const prefersReduced = useReducedMotion();

  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'services') : null, [firestore]);
  const { data: services } = useCollection<Service>(servicesQuery);

  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { 
        hidden: { opacity: 0, scale: 0.98 }, 
        show: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] } } 
      };

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
        <motion.div initial="hidden" animate={open ? "show" : "hidden"} variants={variants}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
               <CommandItem onSelect={() => runCommand(() => router.push("/services"))}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Services</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/audit"))}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Audit Log</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/search"))}>
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/connections"))}>
                <Network className="mr-2 h-4 w-4" />
                <span>Connections</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem>
                <Zap className="mr-2 h-4 w-4" />
                <span>Test Bridge Connection</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Zap className="mr-2 h-4 w-4" />
                <span>Rotate GitHub Key</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Services">
              {services?.slice(0,5).map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.name}
                  onSelect={() => runCommand(() => router.push(`/services/${service.id}`))}
                >
                  <ServiceIcon name={service.icon} className="mr-2 h-4 w-4" />
                  <span>{service.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Favorites">
                <CommandItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Restart Pods: Auth Service</span>
                </CommandItem>
                <CommandItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Scale Workers: Content Processor</span>
                </CommandItem>
                <CommandItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Flush CDN</span>
                </CommandItem>
            </CommandGroup>
          </CommandList>
        </motion.div>
    </CommandDialog>
  )
}

    