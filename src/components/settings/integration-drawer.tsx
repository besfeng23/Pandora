
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import type { Connection } from "@/lib/data-types";
import { fmtRel } from "@/lib/utils";

type IntegrationDrawerProps = {
  integration: Connection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IntegrationDrawer({ integration, open, onOpenChange }: IntegrationDrawerProps) {
  if (!integration) return null;

  const hasWebhook = !!integration.webhook;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-none rounded-tl-2xl rounded-bl-2xl anim-slide-in-right">
        <SheetHeader>
          <SheetTitle>{integration.name} Integration</SheetTitle>
          <SheetDescription>
            Manage connection details and settings for {integration.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key (masked)</Label>
            <Input id="api-key" type="password" defaultValue="************************" className="rounded-xl" />
          </div>
          {hasWebhook && (
            <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" readOnly defaultValue={integration.webhook?.endpoint || ''} className="rounded-xl bg-muted" />
            </div>
           )}
          <div className="grid gap-2">
            <Label>Scopes</Label>
            <div className="flex flex-wrap gap-2">
                {integration.scopes.map(scope => (
                  <Badge key={scope} variant="secondary" className="rounded-lg">{scope}</Badge>
                ))}
            </div>
          </div>
           <Separator />
           <div className="text-sm space-y-1">
             <p className="font-medium">Last test</p>
             <div className="text-muted-foreground">
                <p>Last Sync: {fmtRel(integration.health.lastSyncISO)}</p>
                <p>RTT: {integration.health.latencyP95} ms</p>
                <p className="capitalize">Status: {integration.status}</p>
             </div>
           </div>
        </div>
        <SheetFooter className="gap-2 sm:justify-between">
           <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">Test via Bridge</Button>
            <Button variant="outline" className="rounded-xl">Rotate Key</Button>
           </div>
           <div className="flex gap-2">
            <Button variant="destructive" className="rounded-xl">Delete</Button>
            <Button type="submit" className="rounded-xl">Save</Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
