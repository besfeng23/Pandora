"use client";

// Base44 / Pandora — Audit "Polaris" (Aligned, Accessible, Mobile-first)
// Single-file page using shadcn/ui + Tailwind + lucide-react.
// Highlights:
// - Container-based layout aligned to app grid (1/8/12 cols)
// - Mobile Sheet for Filters, sticky header with actions
// - KPI strip responsive (2 cols on mobile, 4 on md+)
// - Timeline cards and Copilot rail; Ledger placeholder
// - Virtualization kept simple for clarity (can be swapped later)
// - A11y: roles/labels on Tabs, toggles, search; focus-visible maintained
// - No external providers, no useToast

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell, CheckCircle2, Clock, Download, ExternalLink, Filter, Loader2,
  Pause, Play, Search, ShieldCheck, TriangleAlert, ChevronDown, ChevronUp
} from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

// Types
export type AuditEvent = {
  id: string;
  ts: string;
  service: string;
  env: "Dev" | "Prod" | "Stg";
  region: string;
  title: string;
  result: "Success" | "Fail";
  latency_ms?: number;
  severity: "info" | "warn" | "error" | "critical";
  badges?: { label: string; variant: "default" | "warning" | "destructive" }[];
};

export type KPIs = {
  events: number; eventsDelta: number;
  actors: number; actorsDelta: number;
  services: number; servicesDelta: number;
  failures: number; failuresDelta: number;
};

// Mock API (swap to real)
async function fetchAudit(fromIso: string, toIso: string): Promise<{ items: AuditEvent[]; kpis: KPIs }>{
  await new Promise(r=>setTimeout(r, 220));
  const now = Date.now();
  const items: AuditEvent[] = [
    { id: "1", ts: new Date(now - 5*60*1000).toISOString(), service: "GitHub", env: "Dev", region: "us-central1", title: "User updated settings", result: "Success", latency_ms: 22, severity: "info" },
    { id: "2", ts: new Date(now - 18*60*1000).toISOString(), service: "Notion", env: "Prod", region: "us-east1", title: "Token modified layout", result: "Fail", latency_ms: 122, severity: "error", badges:[{label:"BSAC", variant:"warning"},{label:"Maintenance window", variant:"default"}] },
    { id: "3", ts: new Date(now - 41*60*1000).toISOString(), service: "Linear", env: "Prod", region: "us-east1", title: "System ran job", result: "Success", latency_ms: 222, severity: "info" },
    { id: "4", ts: new Date(now - 63*60*1000).toISOString(), service: "Stripe", env: "Prod", region: "us-west2", title: "User created checkout", result: "Success", latency_ms: 1500, severity: "info" },
  ];
  const kpis: KPIs = { events: 987, eventsDelta: +15, actors: 54, actorsDelta: +22, services: 16, servicesDelta: +9, failures: 12, failuresDelta: -18 };
  return { items, kpis };
}

const sevDot: Record<AuditEvent["severity"], string> = {
  info: "bg-sky-500", warn: "bg-amber-500", error: "bg-rose-500", critical: "bg-red-700",
};
const resIcon: Record<AuditEvent["result"], React.ReactNode> = {
  Success: <CheckCircle2 className="h-4 w-4 text-emerald-600"/>,
  Fail: <TriangleAlert className="h-4 w-4 text-rose-600"/>,
};
const fmtMs = (n?: number) => n!=null ? `${n}ms` : "—";

export default function AuditPolaris(){
  const [range, setRange] = useState("Last 24 hours");
  const [live, setLive] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [drawer, setDrawer] = useState<AuditEvent | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const timeWindow = useMemo(()=>{
    const now = new Date(); const to = now.toISOString(); const from = new Date(now.getTime() - 24*3600000).toISOString();
    return {from, to};
  },[]);

  const load = useCallback(async ()=>{
    setLoading(true);
    const res = await fetchAudit(timeWindow.from, timeWindow.to);
    setEvents(res.items); setKpis(res.kpis);
    setLoading(false);
  },[timeWindow]);

  useEffect(()=>{ load(); },[load]);
  useEffect(()=>{ if(!live) return; const t = window.setInterval(load, 3000); return ()=>window.clearInterval(t); },[live, load]);

  return (
    <div className="container mx-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Audit</h1>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Input aria-label="Search events, actors, resources" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events, actors, resources…" className="pl-9 w-[70vw] max-w-[520px]" />
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
              <Toggle aria-label="Live Tail" aria-pressed={live} pressed={live} onPressedChange={setLive} className="gap-2 rounded-full">
                {live? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>} Live Tail
              </Toggle>
              <Button className="gap-2"><Bell className="h-4 w-4"/>Create Alert</Button>
              <Button variant="outline" className="md:hidden" onClick={()=>setFiltersOpen(true)}><Filter className="h-4 w-4 mr-2"/>Filters</Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
          <Tile label="Events" value={kpis.events} delta={kpis.eventsDelta} />
          <Tile label="Unique Actors" value={kpis.actors} delta={kpis.actorsDelta} />
          <Tile label="Services" value={kpis.services} delta={kpis.servicesDelta} />
          <Tile label="Failures" value={kpis.failures} delta={kpis.failuresDelta} />
        </div>
      )}

      {/* Grid: 1 / 8 / 12 */}
      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 pb-6">
        {/* Filters rail (hidden on mobile) */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
          <FiltersPanel />
        </aside>

        {/* Timeline */}
        <main className="md:col-span-5 lg:col-span-6 space-y-4">
          <Card className="border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-4 pt-4 pb-2 text-sm text-slate-600">
              <div className="font-medium">Timeline</div>
              <Button variant="ghost" size="sm" className="gap-1 text-slate-600"><Filter className="h-4 w-4"/>Refine</Button>
            </div>
            <Separator/>
            <ScrollArea className="h-[60vh] md:h-[600px]">
              <div className="p-4 space-y-3">
                {events.map(ev => <EventCard key={ev.id} ev={ev} onOpen={()=>setDrawer(ev)} />)}
                {loading && <div className="flex items-center justify-center py-8 text-slate-500 text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Loading…</div>}
              </div>
            </ScrollArea>
          </Card>

          {/* Ledger placeholder (kept to match tabs parity) */}
          <Card className="border border-slate-200/80 shadow-sm">
            <div className="p-6 text-sm text-slate-500">Ledger grid placeholder. Wire your data table here.</div>
          </Card>
        </main>

        {/* Copilot rail */}
        <aside className="md:col-span-8 lg:col-span-3">
          <CopilotPanel />
          <div className="h-4"/>
          <CopilotPanel variant="secondary" />
        </aside>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="w-[85vw] p-0">
          <SheetHeader className="px-4 pt-4 pb-2"><SheetTitle>Filters</SheetTitle></SheetHeader>
          <Separator/>
          <ScrollArea className="h-[calc(100vh-4.5rem)]">
            <div className="p-4"><FiltersInner /></div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Event Drawer */}
      <Sheet open={!!drawer} onOpenChange={(v)=>!v && setDrawer(null)}>
        <SheetContent side="right" className="w-[92vw] sm:w-[520px] p-0">
          <SheetHeader className="px-6 pt-6 pb-2">
            <SheetTitle>{drawer?.title}</SheetTitle>
            <p className="text-slate-500 text-sm">{drawer && new Date(drawer.ts).toLocaleString()} • {drawer?.service} • {drawer?.env} • {drawer?.region}</p>
          </SheetHeader>
          <Separator/>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-6 space-y-4">
              <DetailRow label="Result" value={drawer?.result === 'Success' ? 'Success' : 'Fail'} icon={drawer?.result === 'Success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600"/> : <TriangleAlert className="h-4 w-4 text-rose-600"/>} />
              <DetailRow label="Latency" value={fmtMs(drawer?.latency_ms)} icon={<Clock className="h-4 w-4"/>} />
              <DetailRow label="Integrity" value="signed" icon={<ShieldCheck className="h-4 w-4"/>} />
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" className="gap-1"><ExternalLink className="h-4 w-4"/>Open in Service</Button>
                <Button className="gap-1">Generate Evidence</Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
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

function FiltersPanel(){
  return (
    <Card className="border border-slate-200/80 shadow-sm">
      <ScrollArea className="h-[60vh] md:h-[600px]">
        <div className="p-4"><FiltersInner /></div>
      </ScrollArea>
    </Card>
  );
}

function FiltersInner(){
  return (
    <div className="space-y-5">
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
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="pt-1"><div className={`h-2 w-2 rounded-full ${sevDot[ev.severity]}`}/></div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] md:text-base font-medium text-slate-900 truncate">{ev.title}</div>
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
            <div className="pt-1">
              <Button variant="ghost" size="sm" className="gap-1 text-slate-600" onClick={onOpen}>Details <ExternalLink className="h-4 w-4"/></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({label, value, icon}:{label:string; value?:string; icon?:React.ReactNode}){
  return (
    <div className="text-sm text-slate-700 flex items-center gap-2">
      {icon}<span className="w-28 text-slate-500">{label}</span><span>{value}</span>
    </div>
  );
}

function CopilotPanel({variant}:{variant?:"secondary"}){
  return (
    <Card className={`border border-slate-200/80 shadow-sm ${variant?"bg-slate-50":""}`}>
      <CardHeader className="pb-2"><CardTitle className="text-sm">AI Copilot</CardTitle></CardHeader>
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
          <div className="font-medium">Verify Signatures</div>
          <Button size="sm" variant="outline">Verify</Button>
        </div>
      </CardContent>
    </Card>
  );
}
