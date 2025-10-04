
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Connection } from "@/lib/data";
import { CheckCircle, XCircle } from "lucide-react";

type ConnectionDetailsDrawerProps = {
  connection: Connection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function OverviewTab({ connection }: { connection: Connection }) {
    return (
        <div className="space-y-6">
             <div>
                <h4 className="font-medium mb-2">Health Checks</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Token Valid</span>
                        <span className="text-muted-foreground">OK</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> API Reachable</span>
                         <span className="text-muted-foreground">OK</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-destructive" /> Webhook Ping</span>
                         <Button variant="link" size="sm" className="h-auto p-0">Retry</Button>
                    </div>
                </div>
            </div>
            <Separator />
            <div>
                <h4 className="font-medium mb-2">Usage</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Latency p95</span>
                        <span>{connection.health.latencyP95}ms</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Errors (24h)</span>
                        <span>{connection.health.error24h}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>API Quota</span>
                        <span>{connection.health.quotaUsedPct}% used</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TestsTab() {
    return (
        <div className="text-center text-muted-foreground p-8">
            <p>Connection tests coming soon.</p>
        </div>
    )
}


export function ConnectionDetailsDrawer({ connection, open, onOpenChange }: ConnectionDetailsDrawerProps) {
  if (!connection) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[520px] sm:max-w-none rounded-tl-2xl rounded-bl-2xl anim-slide-in-right p-0">
        <SheetHeader className="p-6">
          <SheetTitle>{connection.name} Connection</SheetTitle>
          <SheetDescription>
            Manage health, secrets, and webhooks for this connection.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="px-6 w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="scopes" className="rounded-none">Scopes</TabsTrigger>
                <TabsTrigger value="secrets" className="rounded-none">Secrets</TabsTrigger>
                <TabsTrigger value="tests" className="rounded-none">Tests</TabsTrigger>
            </TabsList>
            <div className="p-6">
                <TabsContent value="overview">
                    <OverviewTab connection={connection} />
                </TabsContent>
                 <TabsContent value="scopes">
                     <div className="flex flex-wrap gap-2">
                        {connection.scopes.map(scope => (
                            <Badge key={scope} variant="secondary" className="rounded-lg">{scope}</Badge>
                        ))}
                    </div>
                 </TabsContent>
                 <TabsContent value="secrets">
                     <p className="text-sm text-muted-foreground">Secrets management coming soon.</p>
                 </TabsContent>
                 <TabsContent value="tests">
                    <TestsTab />
                 </TabsContent>
            </div>
        </Tabs>
        
        <SheetFooter className="p-6 border-t mt-auto">
           <Button variant="destructive" className="rounded-lg">Remove</Button>
           <Button className="rounded-lg">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
