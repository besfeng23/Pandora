
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
import { CheckCircle, XCircle, ChevronRight, Download, RotateCcw } from "lucide-react";

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
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Token Valid</span>
                        <span className="text-muted-foreground">OK</span>
                    </div>
                     <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> API Reachable</span>
                         <span className="text-muted-foreground">OK</span>
                    </div>
                     <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
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
        <div className="space-y-4">
            <Button className="w-full rounded-lg">Run all tests <ChevronRight className="ml-auto h-4 w-4" /></Button>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Auth Check</span>
                    <span className="text-muted-foreground">Passed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Rate Limit Check</span>
                    <span className="text-muted-foreground">Passed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-destructive" /> Webhook Delivery</span>
                    <Button variant="link" size="sm" className="h-auto p-0">Fix</Button>
                </div>
            </div>
        </div>
    )
}


export function ConnectionDetailsDrawer({ connection, open, onOpenChange }: ConnectionDetailsDrawerProps) {
  if (!connection) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[520px] sm:max-w-none rounded-tl-2xl rounded-bl-2xl anim-slide-in-right p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{connection.name} Connection</SheetTitle>
          <SheetDescription>
            Manage health, secrets, and webhooks for this connection.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="px-6 w-full justify-start rounded-none border-b bg-transparent p-0 sticky top-0 bg-background z-10">
                    <TabsTrigger value="overview" className="rounded-none data-[state=active]:shadow-none">Overview</TabsTrigger>
                    <TabsTrigger value="scopes" className="rounded-none data-[state=active]:shadow-none">Scopes</TabsTrigger>
                    <TabsTrigger value="secrets" className="rounded-none data-[state=active]:shadow-none">Secrets</TabsTrigger>
                    <TabsTrigger value="tests" className="rounded-none data-[state=active]:shadow-none">Tests</TabsTrigger>
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
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Manage your connection secrets and rotation policy.</p>
                            <Button className="w-full rounded-lg"><RotateCcw className="mr-2 h-4 w-4" /> Rotate key</Button>
                            <Button variant="secondary" className="w-full rounded-lg"><Download className="mr-2 h-4 w-4" /> Export keyfile</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="tests">
                        <TestsTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
        
        <SheetFooter className="p-6 border-t mt-auto bg-background z-10">
           <Button variant="destructive" className="rounded-lg">Remove</Button>
           <div className="flex-grow" />
           <Button variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button className="rounded-lg">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
