
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Service } from "@/lib/data-types";

type AddConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddConnectionDialog({ open, onOpenChange }: AddConnectionDialogProps) {
  const firestore = useFirestore();
  const { data: services } = useCollection<Service>(collection(firestore, 'services'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
          <DialogDescription>
            Configure a new connection between services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">
              Source
            </Label>
            <Select>
              <SelectTrigger id="source" className="col-span-3 rounded-xl">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target
            </Label>
            <Select>
              <SelectTrigger id="target" className="col-span-3 rounded-xl">
                <SelectValue placeholder="Select a target" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transport" className="text-right">
              Transport
            </Label>
             <Select>
              <SelectTrigger id="transport" className="col-span-3 rounded-xl">
                <SelectValue placeholder="Select transport" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="queue">Queue</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              Health Threshold (ms)
            </Label>
            <Input id="threshold" type="number" defaultValue="500" className="col-span-3 rounded-xl" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="rounded-xl">Create Connection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
