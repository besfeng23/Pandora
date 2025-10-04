"use client";

// Base44 / Pandora — Audit Exact Replica UI
// Single-file React page matching the provided mock: header search, KPI tiles, Filters/Ledger tabs,
// timeline cards, right AI Copilot rail. Uses shadcn/ui + Tailwind + lucide-react.
// Replace MOCK_API with your real data source when you're done admiring pixels.

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Filter,
  List,
  Loader2,
  Play,
  Pause,
  Search,
  ShieldCheck,
  TriangleAlert,
  Check,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ===== shadcn/ui =====
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

// ===== Types =====
export type AuditEvent = {
  id: string;
  ts: string;
  service: string; // GitHub, Notion, Linear, Stripe, etc.
  env: "Dev" | "Prod" | "Stg";
  region: string; // us-east1, us-west2
  title: string; // "User updated settings"
  result: "Success" | "Fail";
  latency_ms?: number;
  severity: "info" | "warn" | "error" | "critical";
  badges?: { label: string; variant: "default" | "warning" | "destructive" }[]; // e.g., BSAC Maintenance window
};

export type KPIs = {
  events: number; eventsDelta: number;
  actors: number; actorsDelta: number;
  services: number; servicesDelta: number;
  failures: number; failuresDelta: number;
};

// ===== Mock API =====
async function MOCK_API(fromIso: string, toIso: string): Promise<{ items: AuditEvent[]; kpis: KPIs }>{
  await new Promise(r=>setTimeout(r, 220));
  const now = Date.now();
  const items: AuditEvent[] = [
    { id: "1", ts: new Date(now - 4.5*60*1000).toISOString(), service: "GitHub", env: "Dev", region: "us-central1", title: "User updated settings", result: "Success", latency_ms: 22, severity: "info" },
    { id: "2", ts: new Date(now - 18*60*1000).toISOString(), service: "Notion", env: "Prod", region: "us-east1", title: "Token modified layout", result: "Fail", latency_ms: 122, severity: "error", badges:[{label:"BSAC", variant:"warning"},{label:"Maintenance window", variant:"default"}] },
    { id: "3", ts: new Date(now - 41*60*1000).toISOString(), service: "Linear", env: "Prod", region: "us-east1", title: "System ran job", result: "Success", latency_ms: 222, severity: "info" },
    { id: "4", ts: new Date(now - 63*60*1000).toISOString(), service: "Stripe", env: "Prod", region: "us-west2", title: "User created checkout", result: "Success", latency_ms: 1500, severity: "info" },
  ];
  const kpis: KPIs = { events: 987, eventsDelta: +15, actors: 54, actorsDelta: +22, services: 16, servicesDelta: +9, failures: 12, failuresDelta: -18 };
  return { items, kpis };
}

// ===== Helpers =====
const sevDot: Record<AuditEvent["severity"], string> = {
  info: "bg-blue-500",
  warn: "bg-amber-500",
  error: "bg-rose-500",
  critical: "bg-red-700",
};
const resIcon: Record<AuditEvent["result"], React.ReactNode> = {
  Success: <CheckCircle2 className="h-4 w-4 text-emerald-600"/>,
  Fail: <TriangleAlert className="h-4 w-4 text-rose-600"/>,
};
const fmtMs = (n?: number) => n!=null ? `${n}ms` : "—";

function MiniToast({msg}:{msg:string}){return <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg/50">{msg}</div>}

// ===== Main =====
export default function AuditReplica(){
  const [range, setRange] = useState("Last 24 hours");
  const [live, setLive] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [open, setOpen] = useState<AuditEvent | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const timeWindow = useMemo(()=>{
    const now = new Date();
    const to = now.toISOString();
    const from = new Date(now.getTime() - 24*3600000).toISOString();
    return { from, to };
  },[]);

  const load = useCallback(async ()=>{
    setLoading(true);
    const res = await MOCK_API(timeWindow.from, timeWindow.to);
    setEvents(res.items);
    setKpis(res.kpis);
    setLoading(false);
  },[timeWindow]);

  useEffect(()=>{ load(); }, [load]);
  useEffect(()=>{ if(!live) return; const t = window.setInterval(load, 3000); return ()=>window.clearInterval(t); },[live, load]);

  useEffect(()=>{ if(!toastMsg) return; const t = window.setTimeout(()=>setToastMsg(null), 1600); return ()=>window.clearTimeout(t); },[toastMsg]);

  return (
    <div className="mx-auto max-w-[1280px] p-6">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Audit</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events, actors, resources…" className="pl-9 w-[420px]" />
            <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5"/>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Last 24 hours"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 1 hour">Last 1 hour</SelectItem>
              <SelectItem value="Last 24 hours">Last 24 hours</SelectItem>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Toggle pressed={live} onPressedChange={setLive} className="gap-2 rounded-full" aria-label="Live Tail">
            {live? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
            Live Tail
          </Toggle>
          <Button className="gap-2"><Bell className="h-4 w-4"/>Create Alert</Button>
        </div>
      </div>

      {/* KPI strip */}
      {kpis && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Tile label="Events" value={kpis.events} delta={kpis.eventsDelta} />
          <Tile label="Unique Actors" value={kpis.actors} delta={kpis.actorsDelta} />
          <Tile label="Services" value={kpis.services} delta={kpis.servicesDelta} />
          <Tile label="Failures" value={kpis.failures} delta={kpis.failuresDelta} />
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Filters + Ledger */}
        <div className="col-span-3">
          <Tabs defaultValue="filters">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="ledger">Ledger</TabsTrigger>
            </TabsList>
            <TabsContent value="filters">
              <Card className="border border-slate-200/80 shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-5">
                    <Group title="Saved View" links={["Default", "Prod Errors"]} />
                    <Group title="Environment" pills={["Dev","Stg","Prod"]} />
                    <Group title="Service" pills={["GitHub","Notion","Linear","Stripe","GCP"]} />
                    <Group title="Tool" pills={["CreateIssue","UpdateSecret","SyncPage","RunJob","Deploy"]} />
                    <Group title="Severity" pills={["Info","Warn","Error","Critical"]} />
                    <Group title="Result" pills={["Success","Fail"]} />
                    <Group title="Actor" pills={["user@base44.com","automation","system"]} />
                    <Group title="Source" pills={["UI","API","CLI","Automation"]} />
                    <Group title="Resource Type" pills={["doc","job","secret"]} />
                    <Group title="Region" pills={["us-east1","us-west2","eu-west1"]} />
                    <Group title="Tags" pills={["mcp","signed"]} />
                    <div className="pt-2">
                      <div className="text-xs text-slate-500 mb-2">Advanced</div>
                      <div className="flex items-center gap-2 text-sm"><input type="checkbox" id="signed" className="rounded"/><label htmlFor="signed">Signed only</label></div>
                      <div className="flex items-center gap-2 text-sm mt-1"><input type="checkbox" id="unsigned" className="rounded"/><label htmlFor="unsigned">Unsigned only</label></div>
                    </div>
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>
            <TabsContent value="ledger">
              <Card className="border border-slate-200/80 shadow-sm">
                <div className="p-6 text-sm text-slate-500">Ledger grid goes here (wire to your table later).</div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Timeline column */}
        <div className="col-span-6">
          <Card className="border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-4 pt-4 pb-2 text-sm text-slate-600">
              <div className="font-medium">Timeline</div>
              <Button variant="ghost" size="sm" className="gap-1 text-slate-600"><Filter className="h-4 w-4"/>Refine</Button>
            </div>
            <Separator/>
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-3">
                {events.map(ev => (
                  <EventCard key={ev.id} ev={ev} onOpen={()=>setOpen(ev)} />
                ))}
                {loading && <div className="flex items-center justify-center py-8 text-slate-500 text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Loading…</div>}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* AI Copilot rail */}
        <div className="col-span-3">
          <CopilotPanel />
          <div className="h-4"/>
          <CopilotPanel variant="secondary" />
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={!!open} onOpenChange={(v)=>!v && setOpen(null)}>
        <SheetContent side="right" className="w-[520px] p-0">
          <SheetHeader className="px-6 pt-6 pb-2">
            <SheetTitle>{open?.title}</SheetTitle>
            <SheetDescription className="text-slate-500">{open && new Date(open.ts).toLocaleString()} • {open?.service} • {open?.env} • {open?.region}</SheetDescription>
          </SheetHeader>
          <Separator/>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-6 space-y-4">
              <div className="text-sm text-slate-700 flex items-center gap-2"><Clock className="h-4 w-4"/>Latency {fmtMs(open?.latency_ms)}</div>
              <div className="text-sm text-slate-700 flex items-center gap-2">Result {open?.result === 'Success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600"/> : <TriangleAlert className="h-4 w-4 text-rose-600"/>}</div>
              <div className="text-sm text-slate-700 flex items-center gap-2">Integrity <ShieldCheck className="h-4 w-4"/> signed</div>
              <div className="flex gap-2 pt-2"><Button variant="outline" className="gap-1"><ExternalLink className="h-4 w-4"/>Open in Service</Button><Button className="gap-1">Generate Evidence</Button></div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {toastMsg && <MiniToast msg={toastMsg}/>}  
    </div>
  );
}

function Tile({label, value, delta}:{label:string; value:number; delta:number}){
  const good = delta >= 0; const color = good?"text-emerald-600":"text-rose-600"; const arrow = good?"▲":"▼";
  return (
    <Card className="border border-slate-200/80 shadow-sm">
      <CardContent className="p-4">
        <div className="text-xs text-slate-500 mb-1">{label}</div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          <div className={`text-xs ${color}`}>{arrow} {Math.abs(delta)}%</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Group({title, pills, links}:{title:string; pills?:string[]; links?:string[]}){
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={()=>setOpen(v=>!v)} className="w-full flex items-center justify-between text-sm text-slate-700">
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500"/> : <ChevronDown className="h-4 w-4 text-slate-500"/>}
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-2">
          {pills?.map(p=> <span key={p} className="px-2.5 py-1 rounded-full border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">{p}</span>)}
          {links?.map(l=> <a key={l} className="px-2.5 py-1 rounded-full border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">{l}</a>)}
        </div>
      )}
    </div>
  );
}

function EventCard({ev, onOpen}:{ev:AuditEvent; onOpen:()=>void}){
  return (
    <div className="relative">
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Left status column */}
            <div className="pt-1">
              <div className={`h-2 w-2 rounded-full ${sevDot[ev.severity]}`}/>
            </div>
            {/* Main */}
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-medium text-slate-900 truncate">{ev.title}</div>
              <div className="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">{ev.service}</Badge>
                <Badge variant="outline" className="rounded-full">{ev.env}</Badge>
                <Badge variant="outline" className="rounded-full">{ev.region}</Badge>
                {ev.badges?.map(b => (
                  <Badge key={b.label} variant={b.variant === 'destructive' ? 'destructive' : b.variant === 'warning' ? 'secondary' : 'outline'} className="rounded-full">{b.label}</Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-1">{resIcon[ev.result]} {ev.result}</div>
                <div className="flex items-center gap-1 text-slate-500"><Clock className="h-4 w-4"/>{fmtMs(ev.latency_ms)}</div>
              </div>
            </div>
            {/* Right */}
            <div className="pt-1">
              <Button variant="ghost" size="sm" className="gap-1 text-slate-600" onClick={onOpen}>Details <ExternalLink className="h-4 w-4"/></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CopilotPanel({variant}:{variant?:"secondary"}){
  return (
    <Card className="border border-slate-200/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">AI Copilot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <div className="mt-1 h-2 w-2 rounded-full bg-sky-500"/>
          <div>
            <div className="font-medium">2 anomalies detected</div>
            <div className="text-slate-500">Search for high error rates</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium">Generate evidence bundle</div>
            <div className="text-slate-500">Secures signatures</div>
          </div>
          <Button size="sm" variant="outline">Run</Button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium">Verify Signatures</div>
          </div>
          <Button size="sm" variant="outline">Verify</Button>
        </div>
      </CardContent>
    </Card>
  );
}
