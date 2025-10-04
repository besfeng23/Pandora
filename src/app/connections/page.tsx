
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronsUpDown,
  Filter,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  Search,
  CheckCircle,
  XCircle,
  ChevronRight,
  Download,
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
import { cn } from "@/lib/utils";
import { quickConnectProviders } from "@/lib/data";

// ---------- Types ----------

export type Env = "dev" | "staging" | "prod";

export type Status = "active" | "warning" | "error" | "pending" | "paused";

export type Provider = {
  id: string;
  name: string;
  category: "dev" | "cloud" | "billing" | "docs" | "chat" | "db";
  recommendedScopes?: string[];
};

export type Health = {
  lastSyncISO?: string; // ISO timestamp
  latencyP95?: number; // ms
  error24h?: number;
  quotaUsedPct?: number; // 0..100
};

export type TestResult = { name: string; pass: boolean; fixAction?: FixId };

export type FixId =
  | "reauth"
  | `add_scope:${string}`
  | "rotate_secret"
  | "replay_webhook"
  | "lower_rate"
  | "upgrade_plan";

export type Connection = {
  id: string; // unique per provider+env
  name: string;
  providerId: string;
  env: Env;
  status: Status;
  scopes: string[];
  secretRef?: string;
  webhook?: {
    endpoint?: string;
    secret?: string;
    lastDeliveries?: Array<{ id: string; status: number; ms: number; ts: string }>;
  };
  usage7d: number[]; // for sparkline
  health: Health;
  lastRotatedISO?: string;
  lastTests?: TestResult[];
};

// ---------- Utilities ----------

const fmtRel = (iso?: string) => {
  if (!iso) return "Never";
  const now = Date.now();
  const d = new Date(iso).getTime();
  const diff = Math.max(0, now - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

const statusClasses: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
  paused: "bg-gray-100 text-gray-800",
};


// Small hooks
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initial;
    }
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }
  }, [key, val]);
  return [val, setVal];
}

function useDebounced<T>(value: T, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}


// ---------- Fake seed data (kept) ----------

const seedConnections: Connection[] = [
  {
    id: "github:prod",
    providerId: "github",
    name: "GitHub",
    env: "prod",
    status: "active",
    scopes: ["repo", "read:user"],
    usage7d: [4, 5, 3, 6, 5, 8, 10],
    health: { lastSyncISO: new Date(Date.now() - 7 * 60 * 1000).toISOString(), latencyP95: 220, error24h: 0, quotaUsedPct: 18 },
    webhook: {
      endpoint: "https://pandora.app/webhooks/github",
      secret: "vault://secrets/github",
      lastDeliveries: [
        { id: "evt_1", status: 200, ms: 134, ts: new Date().toISOString() },
      ],
    },
    lastRotatedISO: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notion:prod",
    providerId: "notion",
    name: "Notion",
    env: "prod",
    status: "warning",
    scopes: ["pages.read"],
    usage7d: [0, 0, 1, 1, 0, 2, 1],
    health: { lastSyncISO: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), latencyP95: 410, error24h: 0, quotaUsedPct: 64 },
    lastRotatedISO: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "slack:prod",
    providerId: "slack",
    name: "Slack",
    env: "prod",
    status: "error",
    scopes: ["channels:read"],
    usage7d: [3, 3, 3, 0, 0, 0, 0],
    health: { lastSyncISO: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), latencyP95: 999, error24h: 12, quotaUsedPct: 10 },
    lastRotatedISO: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "linear:staging",
    providerId: "linear",
    name: "Linear",
    env: "staging",
    status: "pending",
    scopes: ["read:issues"],
    usage7d: [0, 0, 0, 0, 0, 0, 0],
    health: { quotaUsedPct: 0 },
  },
];

// ---------- Fake API layer (improved determinism) ----------

const api = {
  async startConnect(providerId: string, env: Env): Promise<Connection> {
    await sleep(400);
    const p = quickConnectProviders.find(p => p.id === providerId)!;
    const base: Connection = {
      id: `${providerId}:${env}`,
      providerId,
      name: p.name,
      env,
      status: "pending",
      scopes: [],
      usage7d: Array.from({ length: 7 }, () => Math.floor(Math.random() * 8)),
      health: { quotaUsedPct: Math.floor(Math.random() * 30) },
      webhook: { endpoint: `https://pandora.app/webhooks/${providerId}`, secret: "vault://…", lastDeliveries: [] },
      secretRef: `vault://secrets/${providerId}-${env}`,
      lastRotatedISO: new Date().toISOString(),
    };
    _mem[base.id] = base;
    return base;
  },
  async runAutoTests(id: string): Promise<Connection> {
    await sleep(500);
    const conn = getConn(id);
    const now = new Date().toISOString();
    const results: TestResult[] = [
      { name: "auth.check", pass: true },
      { name: "whoami", pass: Math.random() > 0.03 },
      { name: "rate.limit", pass: true },
      { name: "webhook.ping", pass: Math.random() > 0.1, fixAction: "replay_webhook" },
      { name: "sample.read(1)", pass: true },
    ];
    const passed = results.every((r) => r.pass);
    const status: Status = passed ? "active" : "warning";
    return setConn({
      ...conn,
      status,
      lastTests: results,
      health: { ...conn.health, lastSyncISO: now, error24h: passed ? 0 : 1, latencyP95: Math.floor(150 + Math.random() * 200) },
    });
  },
  async rotateSecret(id: string): Promise<Connection> {
    await sleep(300);
    const conn = getConn(id);
    return setConn({ ...conn, secretRef: `vault://secrets/${conn.providerId}-${conn.env}?rotated=${Date.now()}`, lastRotatedISO: new Date().toISOString() });
  },
};

// In-memory helpers for fake API
const _mem: Record<string, Connection> = Object.fromEntries(seedConnections.map((c) => [c.id, c]));
function getConn(id: string) { return _mem[id]; }
function setConn(c: Connection) { _mem[c.id] = c; return c; }
function upsertConn(arr: Connection[], c: Connection) {
  const i = arr.findIndex((x) => x.id === c.id);
  if (i === -1) return [...arr, c];
  const next = [...arr];
  next[i] = c;
  return next;
}
function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }


// ---------- Root Component ----------

export default function ConnectionsPage() {
  const [env, setEnv] = useLocalStorage<Env>("pandora.env", "prod");
  const [q, setQ] = useState("");
  const qDebounced = useDebounced(q, 200);
  const [connections, setConnections] = useState<Connection[]>(seedConnections);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "lastSync" | "status">("name");
  const [busy, setBusy] = useState<string | null>(null); // providerId being connected

  // Derived view
  const list = useMemo(() => {
    const rows = connections.filter((c) => c.env === env);
    const filtered = rows.filter((c) => {
      if (!qDebounced) return true;
      const providerName = c.name.toLowerCase() || "";
      return providerName.includes(qDebounced.toLowerCase());
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "status") return a.status.localeCompare(b.status);
      const ta = new Date(a.health.lastSyncISO || 0).getTime();
      const tb = new Date(b.health.lastSyncISO || 0).getTime();
      return tb - ta;
    });
    return sorted;
  }, [connections, env, qDebounced, sortBy]);

  const onConnect = async (providerId: string) => {
    setBusy(providerId);
    try {
      const conn = await api.startConnect(providerId, env);
      setConnections((prev) => upsertConn(prev, conn));
      const tested = await api.runAutoTests(conn.id);
      setConnections((prev) => upsertConn(prev, tested));
    } finally {
      setBusy(null);
    }
  };

  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsDrawerOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connections</CardTitle>
            <div className="flex items-center gap-2">
              <EnvSwitch env={env} onChange={setEnv} />
            </div>
          </div>
          <CardDescription>Manage and monitor your service integrations.</CardDescription>
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("lastSync")}>Last Sync</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickConnectCard onConnect={onConnect} busyProvider={busy}/>
            {list.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} onSelect={() => handleSelectConnection(conn)} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ConnectionDetailsDrawer 
        connection={selectedConnection} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        onRotate={async (id) => {
          const next = await api.rotateSecret(id);
          setConnections((prev) => upsertConn(prev, next));
          setSelectedConnection(next);
        }}
        onRunTests={async (id) => {
          const tested = await api.runAutoTests(id);
          setConnections((prev) => upsertConn(prev, tested));
          setSelectedConnection(tested);
        }}
        onPause={async (id) => {
            const pausedConn = { ...getConn(id), status: "paused" as Status };
            setConnections((prev) => upsertConn(prev, pausedConn));
            setSelectedConnection(pausedConn);
        }}
        onResume={async (id) => {
            const resumed = await api.runAutoTests(id);
            setConnections((prev) => upsertConn(prev, resumed));
            setSelectedConnection(resumed);
        }}
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
            {connection.health.lastSyncISO ? fmtRel(connection.health.lastSyncISO) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">API Usage</div>
          <div className="font-medium">{connection.health.quotaUsedPct}%</div>
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
                    disabled={busyProvider === provider.id}
                >
                    <IntegrationLogo name={provider.id} className="h-7 w-7" />
                    <span className="text-xs">{provider.name}</span>
                    {busyProvider === provider.id && <div className="absolute inset-0 bg-background/50 flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div></div>}
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectionDetailsDrawer({ 
  connection, open, onOpenChange, onRotate, onRunTests, onPause, onResume
}: { 
  connection: Connection | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onRotate: (id: string) => void;
  onRunTests: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}) {
  if (!connection) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[520px] sm:max-w-none rounded-tl-2xl rounded-bl-2xl p-0 flex flex-col">
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
                            <Button className="w-full rounded-lg" onClick={() => onRotate(connection.id)}><RotateCcw className="mr-2 h-4 w-4" /> Rotate key</Button>
                            <Button variant="secondary" className="w-full rounded-lg"><Download className="mr-2 h-4 w-4" /> Export keyfile</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="tests">
                        <TestsTab connection={connection} onRunTests={onRunTests} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
        
        <SheetFooter className="p-6 border-t mt-auto bg-background z-10 flex-row justify-between sm:justify-between w-full">
            <div className="flex gap-2">
                {connection.status === 'paused' ? (
                    <Button onClick={() => onResume(connection.id)} className="rounded-lg"><Play className="mr-2 h-4 w-4"/> Resume</Button>
                ) : (
                    <Button variant="outline" onClick={() => onPause(connection.id)} className="rounded-lg"><Pause className="mr-2 h-4 w-4"/> Pause</Button>
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
                        <span>{fmtRel(connection.health.lastSyncISO)}</span>
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
                    <span>{fmtRel(connection.lastRotatedISO)}</span>
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
