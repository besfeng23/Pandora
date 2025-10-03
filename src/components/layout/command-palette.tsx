"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Star,
  Zap,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { services } from "@/lib/data"
import { ServiceIcon } from "@/components/services/service-icon"
import { create } from 'zustand'

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

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/audit"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Audit Log</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Services">
          {services.map((service) => (
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
                <Zap className="mr-2 h-4 w-4" />
                <span>Restart Pods</span>
            </CommandItem>
             <CommandItem>
                <Zap className="mr-2 h-4 w-4" />
                <span>Scale Workers</span>
            </CommandItem>
             <CommandItem>
                <Zap className="mr-2 h-4 w-4" />
                <span>Flush CDN</span>
            </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
