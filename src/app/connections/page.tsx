
"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Loader2,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { IntegrationLogo } from "@/components/connections/integration-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn, fmtRel } from "@/lib/utils";
import { useDebounced, useLocalStorage } from "@/hooks/use-client-helpers";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Connection, Env, Status, TestResult } from "@/lib/data-types";
import { useToast } from "@/components/ui/use-toast";

// In-memory mock data for quick connect providers, will be replaced with Firestore data
export const quickConnectProviders = [
    { id: 'notion', name: 'Notion', icon: 'Notion'},
    { id: 'linear', name: 'Linear', icon: 'Linear'},
    { id: 'github', name: 'GitHub', icon: 'Github'},
    { id: 'slack', name: 'Slack', icon: 'Slack'},
    { id: 'gcp', name: 'GCP', icon: 'Gcp'},
    { id: 'openai', name: 'OpenAI', icon: 'Bot' },
    { id: 'stripe', name: 'Stripe', icon: 'Stripe' },
    { id: 'box', name: 'Box', icon: 'Box' },
]

// ---------- Config ----------

const statusClasses: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
  paused: "bg-gray-100 text-gray-800",
};


// ---------- Root Component ----------

export default function ConnectionsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [env, setEnv] = useLocalStorage<Env>("pandora.env", "prod");
  const [q, setQ] = useState("");
  const qDebounced = useDebounced(q, 200);

  const connectionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'connections');
  }, [firestore]);
  
  const { data: connections, isLoading } = useCollection<Connection>(connectionsQuery);

  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "lastSync" | "status">("name");
  const [busy, setBusy] = useState<string | null>(null); // providerId being connected

  // Derived view
  const list = useMemo(() => {
    if (!connections) return [];
    const rows = connections.filter((c) => c.env === env);
    const filtered = rows.filter((c) => {
      if (!qDebounced) return true;
      const providerName = c.name.toLowerCase() || "";
      return providerName.includes(qDebounced.toLowerCase());
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "status") return a.status.localeCompare(b.status);
      const ta = new Date(a.health?.lastSyncISO || 0).getTime();
      const tb = new Date(b.health?.lastSyncISO || 0).getTime();
      return tb - ta;
    });
    return sorted;
  }, [connections, env, qDebounced, sortBy]);

  const onConnect = async (providerId: string) => {
    if (!firestore) return;
    setBusy(providerId);

    const newConnection: Omit<Connection, 'id'> = {
      name: `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} Integration`,
      providerId: providerId,
      env: env,
      status: 'pending',
      scopes: ['read', 'write'],
      usage7d: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)),
      health: {
        lastSyncISO: new Date().toISOString(),
        latencyP95: 0,
        error24h: 0,
        quotaUsedPct: 0
      },
      lastRotatedISO: new Date().toISOString(),
      lastTests: [],
    };
    
    try {
      addDocumentNonBlocking(collection(firestore, 'connections'), newConnection);
      toast({
        title: "Connection Added",
        description: `Started connecting to ${providerId}.`,
      });
    } catch(e) {
      console.error(e);
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${providerId}.`,
        variant: "destructive"
      });
    } finally {
      setBusy(null);
    }
  };
  
  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsDrawerOpen(true);
  }

  const updateConnection = (conn: Connection) => {
    // This would be an update call to firestore
    console.log("Updating connection", conn);
    setSelectedConnection(conn);
  }

  return (
    <div className="flex flex-col h-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Connections</CardTitle>
              <CardDescription>Manage and monitor your service integrations.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <EnvSwitch env={env} onChange={setEnv} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search connections..."
                className="h-10 w-full rounded-lg pl-10 pr-4 text-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10">
                  <ChevronsUpDown className="mr-2 h-4 w-4" />
                  Sort by: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("lastSync")}>Last Sync</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickConnectCard onConnect={onConnect} busyProvider={busy}/>
            {isLoading ? Array.from({length: 6}).map((_, i) => (
              <Card key={i} className="h-48 rounded-2xl shadow-sm flex flex-col p-4"><div className="animate-pulse flex-grow bg-muted rounded-lg"></div></Card>
             )) : list.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} onSelect={() => handleSelectConnection(conn)} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ConnectionDetailsDrawer 
        connection={selectedConnection} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        onConnectionUpdate={updateConnection}
      />
    </div>
  );
}

// ---------- Components ----------

function EnvSwitch({ env, onChange }: { env: Env; onChange: (e: Env) => void }) {
  const btn = (k: Env, label: string) => (
    <Button
      onClick={() => onChange(k)}
      variant={env === k ? 'secondary' : 'ghost'}
      size="sm"
      className="rounded-lg"
      aria-pressed={env === k}
    >
      {label}
    </Button>
  );
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">{btn("dev", "Dev")}{btn("staging", "Staging")}{btn("prod", "Prod")}</div>
  );
}

function ConnectionCard({
  connection,
  onSelect,
}: {
  connection: Connection;
  onSelect: () => void;
}) {
  const chartData = connection.usage7d.map((value, index) => ({ name: index, value }));
  const isConnected = connection.status === 'active' || connection.status === 'warning' || connection.status === 'error';

  return (
    <Card className="shadow-sm anim-lift flex flex-col p-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IntegrationLogo name={connection.providerId} className="h-6 w-6" />
          <span className="font-semibold">{connection.name}</span>
        </div>
        <Badge className={cn("capitalize text-xs rounded-md", statusClasses[connection.status])}>
          {connection.status}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Last sync</div>
          <div className="font-medium">
            {connection.health?.lastSyncISO ? fmtRel(connection.health.lastSyncISO) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">API Usage</div>
          <div className="font-medium">{connection.health?.quotaUsedPct}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Scopes</div>
          <div className="font-medium">{connection.scopes.length}</div>
        </div>
      </div>

      <div className="mt-4 h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center gap-2">
        <Button onClick={onSelect} className="flex-grow rounded-lg">
          {isConnected ? 'Manage' : 'Connect'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem>Rotate key</DropdownMenuItem>
            <DropdownMenuItem>Pause</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
            <DropdownMenuItem>View logs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

function QuickConnectCard({ onConnect, busyProvider }: { onConnect: (providerId: string) => void, busyProvider: string | null }) {
  return (
    <Card className="rounded-2xl shadow-sm bg-muted/50 border-dashed">
      <CardHeader>
        <CardTitle className="font-semibold text-base">Quick Connect</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
            {quickConnectProviders.slice(0,6).map((provider) => (
                <Button 
                    key={provider.id}
                    variant="secondary"
                    className="h-20 w-full flex-col gap-2 rounded-xl border bg-background"
                    onClick={() => onConnect(provider.id)}
                    disabled={!!busyProvider}
                >
                    {busyProvider === provider.id ? <Loader2 className="h-7 w-7 animate-spin" /> : <IntegrationLogo name={provider.id} className="h-7 w-7" />}
                    <span className="text-xs">{provider.name}</span>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectionDetailsDrawer({ 
  connection, open, onOpenChange, onConnectionUpdate
}: { 
  connection: Connection | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onConnectionUpdate: (connection: Connection) => void;
}) {
  if (!connection) return null;

  const handleRotate = async () => {
    // const updated = await connectionsApi.rotateSecret(connection.id);
    // onConnectionUpdate(updated);
  };
  
  const handleRunTests = async () => {
    // const updated = await connectionsApi.runAutoTests(connection.id);
    // onConnectionUpdate(updated);
  };

  const handlePause = async () => {
    // const updated = await connectionsApi.pause(connection.id);
    // onConnectionUpdate(updated);
  };
  
  const handleResume = async () => {
    // const updated = await connectionsApi.resume(connection.id);
    // onConnectionUpdate(updated);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
              <IntegrationLogo name={connection.providerId} className="h-8 w-8" />
              <div>
                <SheetTitle>{connection.name} Connection</SheetTitle>
                <SheetDescription>
                  Manage health, secrets, and webhooks for this connection.
                </SheetDescription>
              </div>
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="px-6 w-full justify-start rounded-none border-b bg-transparent p-0 sticky top-0 bg-background z-10">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="scopes">Scopes</TabsTrigger>
                    <TabsTrigger value="secrets">Secrets</TabsTrigger>
                    <TabsTrigger value="tests">Tests</TabsTrigger>
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
                            <Button className="w-full rounded-lg" onClick={handleRotate}><RotateCcw className="mr-2 h-4 w-4" /> Rotate key</Button>
                            <Button variant="secondary" className="w-full rounded-lg"><Download className="mr-2 h-4 w-4" /> Export keyfile</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="tests">
                        <TestsTab connection={connection} onRunTests={handleRunTests} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
        
        <SheetFooter className="p-6 border-t mt-auto bg-background z-10 flex-row justify-between sm:justify-between w-full">
            <div className="flex gap-2">
                {connection.status === 'paused' ? (
                    <Button onClick={handleResume} className="rounded-lg"><Play className="mr-2 h-4 w-4"/> Resume</Button>
                ) : (
                    <Button variant="outline" onClick={handlePause} className="rounded-lg"><Pause className="mr-2 h-4 w-4"/> Pause</Button>
                )}
            </div>
           <div className="flex gap-2">
               <Button variant="destructive" className="rounded-lg">Remove</Button>
               <Button className="rounded-lg" onClick={() => onOpenChange(false)}>Done</Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function OverviewTab({ connection }: { connection: Connection }) {
    return (
        <div className="space-y-6">
             <div>
                <h4 className="font-medium mb-2">Health</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span>{connection.health.lastSyncISO ? fmtRel(connection.health.lastSyncISO) : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency p95</span>
                        <span>{connection.health.latencyP95}ms</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Errors (24h)</span>
                        <span>{connection.health.error24h}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">API Quota</span>
                        <span>{connection.health.quotaUsedPct}% used</span>
                    </div>
                </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment</span>
                    <Badge variant="outline" className="capitalize">{connection.env}</Badge>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Rotated</span>
                    <span>{connection.lastRotatedISO ? fmtRel(connection.lastRotatedISO) : 'N/A'}</span>
                </div>
              </div>
            </div>
        </div>
    )
}

function TestsTab({ connection, onRunTests }: { connection: Connection, onRunTests: (id: string) => void }) {
    const [running, setRunning] = useState(false);
    
    const handleRunTests = async () => {
        setRunning(true);
        await onRunTests(connection.id);
        setRunning(false);
    }

    return (
        <div className="space-y-4">
            <Button className="w-full rounded-lg" onClick={handleRunTests} disabled={running}>
              {running ? 'Running...' : 'Run all tests'}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <div className="space-y-2 text-sm">
                {(connection.lastTests || []).map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                        <span className="flex items-center gap-2">
                          {test.pass ? <CheckCircle className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                          {test.name}
                        </span>
                        {!test.pass && test.fixAction && <Button variant="link" size="sm" className="h-auto p-0">Fix</Button>}
                    </div>
                ))}
                {(connection.lastTests || []).length === 0 && (
                    <p className="text-muted-foreground text-center pt-4">No test results yet. Run tests to check connection health.</p>
                )}
            </div>
        </div>
    )
}

    