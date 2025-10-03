
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
import { Textarea } from "@/components/ui/textarea";
import type { Integration } from "@/lib/data";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

type IntegrationDrawerProps = {
  integration: Integration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IntegrationDrawer({ integration, open, onOpenChange }: IntegrationDrawerProps) {
  if (!integration) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-none rounded-tl-2xl rounded-bl-2xl">
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
          <div className="grid gap-2">
            <Label htmlFor="base-url">Base URL (optional)</Label>
            <Input id="base-url" placeholder="https://api.example.com" defaultValue={integration.baseUrl} className="rounded-xl" />
          </div>
           {integration.hasWebhook && (
            <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" readOnly defaultValue={`https://pandora.dev/api/webhooks/${integration.id}`} className="rounded-xl bg-muted" />
            </div>
           )}
          <div className="grid gap-2">
            <Label>Scopes</Label>
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-lg">repo</Badge>
                <Badge variant="secondary" className="rounded-lg">user</Badge>
                <Badge variant="secondary" className="rounded-lg">admin:org</Badge>
            </div>
          </div>
           <Separator />
           <div className="text-sm">
             <p className="font-medium">Last test</p>
             <p className="text-muted-foreground">{integration.lastPingAt}</p>
             <p className="text-muted-foreground">RTT: {integration.latencyP95Ms} ms</p>
             <p className="text-muted-foreground capitalize">Status: {integration.status}</p>
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
