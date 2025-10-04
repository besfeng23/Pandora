
// app/audit/page.tsx  (Next.js App Router)
// or src/pages/audit/index.tsx (CRA/Vite; adjust default export accordingly)

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Download, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2, ShieldAlert, CheckCircle2, CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// ---------- Types ----------
type Severity = "info" | "warning" | "critical";
type Status = "success" | "failed" | "pending";

type AuditRow = {
  id: string;
  ts: string;              // ISO date
  service: string;
  action: string;
  actor: string;
  status: Status;
  severity: Severity;
  resource: string;
  details?: string;
};

// ---------- Config ----------
const PAGE_SIZE = 20;
// Set your Cloud Run or API base here or via env
const API_BASE =
  (process as any)?.env?.NEXT_PUBLIC_API_BASE ||
  ""; // if blank, we’ll mock

// ---------- Helpers ----------
function severityBadge(sev: Severity) {
  const map: Record<Severity, { variant: "default" | "secondary" | "destructive"; icon: React.ReactNode; className?: string }> = {
    info: { variant: "secondary", icon: <CircleHelp className="h-3.5 w-3.5 mr-1.5" /> },
    warning: { variant: "default", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> },
    critical: { variant: "destructive", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> },
  };
  const x = map[sev];
  return (
    <Badge variant={x.variant} className={cn("capitalize", x.className)}>
      {x.icon}
      {sev}
    </Badge>
  );
}

function statusBadge(status: Status) {
  const map: Record<Status, { className: string; icon: React.ReactNode }> = {
    success: { className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> },
    failed: { className: "bg-rose-50 text-rose-700 border border-rose-200", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> },
    pending: { className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> },
  };
  const x = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", x.className)}>
      {x.icon}
      {status}
    </span>
  );
}

function toCSV(rows: AuditRow[]) {
  const header = ["Timestamp","Service","Action","Actor","Status","Severity","Resource","Details"];
  const body = rows.map(r => [
    r.ts, r.service, r.action, r.actor, r.status, r.severity, r.resource, (r.details ?? "").replace(/\n/g, " "),
  ]);
  const csv = [header, ...body].map(line => line.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-t-8;" });
}

// ---------- Data fetching (mock fallback) ----------
async function fetchAudits(
  page: number,
  pageSize: number,
  q: string,
  filters: { severity?: Severity | "all"; status?: Status | "all"; service?: string | "all"; from?: Date | null; to?: Date | null; }
): Promise<{ rows: AuditRow[]; total: number; }> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (q) params.set("q", q);
  if (filters.severity && filters.severity !== "all") params.set("severity", filters.severity);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.service && filters.service !== "all") params.set("service", filters.service);
  if (filters.from) params.set("from", filters.from.toISOString());
  if (filters.to) params.set("to", filters.to.toISOString());

  if (API_BASE) {
    const res = await fetch(`${API_BASE}/audit?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  }

  // Mock data if no API is wired yet. You’re welcome.
  await new Promise(r => setTimeout(r, 400)); // pretend network
  const services = ["Orchestrator","Compliance Logger","FX Rate","Partner Mgmt","Adapter","Health Check","Studio"];
  const actions = ["CREATE","APPROVE","FLAG","REJECT","SYNC","POLL","EXPORT","RUNBOOK"];
  const statuses: Status[] = ["success","failed","pending"];
  const severities: Severity[] = ["info","warning","critical"];

  const base: AuditRow[] = Array.from({ length: 137 }).map((_, i) => {
    const sev = severities[i % 3];
    const st = statuses[(i * 7) % 3];
    const svc = services[(i * 11) % services.length];
    const act = actions[(i * 13) % actions.length];
    const dt = new Date(Date.now() - i * 3600_000).toISOString();
    return {
      id: `mock-${i}`,
      ts: dt,
      service: svc,
      action: act,
      actor: i % 5 === 0 ? "system" : i % 2 ? "eve@edenos" : "admin@redapplex",
      status: st,
      severity: sev,
      resource: `txn/${100000 + i}`,
      details: sev === "critical" ? "Exceeded risk threshold; STR flag proposed." : sev === "warning" ? "Latency above SLO for FX quotes." : "Periodic health ping.",
    };
  });

  // Filter client-side for mock
  let rows = base;
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(r =>
      r.service.toLowerCase().includes(qq) ||
      r.action.toLowerCase().includes(qq) ||
      r.actor.toLowerCase().includes(qq) ||
      r.resource.toLowerCase().includes(qq) ||
      (r.details ?? "").toLowerCase().includes(qq)
    );
  }
  if (filters.severity && filters.severity !== "all") rows = rows.filter(r => r.severity === filters.severity);
  if (filters.status && filters.status !== "all") rows = rows.filter(r => r.status === filters.status);
  if (filters.service && filters.service !== "all") rows = rows.filter(r => r.service === filters.service);
  if (filters.from) rows = rows.filter(r => new Date(r.ts) >= filters.from!);
  if (filters.to) rows = rows.filter(r => new Date(r.ts) <= filters.to!);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { rows: rows.slice(start, end), total };
}

// ---------- Page ----------
export default function AuditPage() {
  const { toast } = useToast();

  // query state
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [severity, setSeverity] = React.useState<Severity | "all">("all");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [service, setService] = React.useState<string | "all">("all");
  const [from, setFrom] = React.useState<Date | null>(null);
  const [to, setTo] = React.useState<Date | null>(null);

  // paging & data
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = React.useState<AuditRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  // derive
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // fetch
  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const { rows, total } = await fetchAudits(page, PAGE_SIZE, debouncedQ, { severity, status, service, from, to });
      setRows(rows);
      setTotal(total);
    } catch (e: any) {
      toast({ title: "Failed to load audit", description: String(e?.message || e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ, severity, status, service, from, to, toast]);

  React.useEffect(() => {
    setPage(1); // reset page when filters/search change
  }, [debouncedQ, severity, status, service, from, to]);

  React.useEffect(() => {
    load();
  }, [load]);

  function resetFilters() {
    setQ("");
    setSeverity("all");
    setStatus("all");
    setService("all");
    setFrom(null);
    setTo(null);
  }

  function exportCSV() {
    if (!rows?.length) {
      toast({ title: "Nothing to export", description: "Filter less aggressively or try another page." });
      return;
    }
    const blob = toCSV(rows);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // dummy service list (replace with API list if you have one)
  const serviceOptions = ["Orchestrator","Compliance Logger","FX Rate","Partner Mgmt","Adapter","Health Check","Studio"];

  return (
    <div className="space-y-6">
      <div className="border rounded-xl">
        <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  aria-label="Search audit"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search service, action, actor, resource, details..."
                  className="pl-8"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Severity */}
                <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status */}
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                {/* Service */}
                <Select value={service} onValueChange={(v: any) => setService(v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All services</SelectItem>
                    {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>

                {/* Date range */}
                <DateRangePicker from={from} to={to} onChange={({ from, to }) => { setFrom(from); setTo(to); }} />

                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border">
          <KpiCard title="Events (page)" value={loading ? "—" : rows.length.toString()} hint="Current page count" />
          <KpiCard title="Total (filtered)" value={loading ? "—" : total.toString()} hint="Across all pages" />
          <KpiCard title="Critical (page)" value={loading ? "—" : rows.filter(r => r.severity === "critical").length.toString()} hint="High priority" />
          <KpiCard title="Failed (page)" value={loading ? "—" : rows.filter(r => r.status === "failed").length.toString()} hint="Needs attention" />
        </div>

        {/* Data area */}
        <div>
            {/* Mobile cards */}
            <div className="md:hidden">
              <ScrollArea className="h-[70dvh] pr-3">
                {loading ? (
                  <MobileSkeleton />
                ) : rows.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-3 p-4">
                    {rows.map(r => <MobileAuditCard key={r.id} row={r} />)}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="relative">
                  {loading && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-background/60">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[210px]">Timestamp</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!loading && rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <EmptyState compact />
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map(r => (
                          <TableRow key={r.id} className="hover:bg-muted/50">
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {format(new Date(r.ts), "yyyy-MM-dd HH:mm:ss")}
                            </TableCell>
                            <TableCell className="font-medium">{r.service}</TableCell>
                            <TableCell className="text-muted-foreground">{r.action}</TableCell>
                            <TableCell className="text-muted-foreground">{r.actor}</TableCell>
                            <TableCell>{statusBadge(r.status)}</TableCell>
                            <TableCell>{severityBadge(r.severity)}</TableCell>
                            <TableCell className="font-mono text-xs">{r.resource}</TableCell>
                            <TableCell className="max-w-[320px]">
                              <div className="truncate text-muted-foreground">{r.details}</div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

// ---------- Subcomponents ----------
function KpiCard(props: { title: string; value: string; hint?: string }) {
  return (
    <div className="bg-card p-4">
      <div className="text-sm text-muted-foreground">{props.title}</div>
      <div className="text-2xl font-semibold tracking-tight">{props.value}</div>
      {props.hint && <div className="text-xs text-muted-foreground mt-1">{props.hint}</div>}
    </div>
  );
}

function EmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("w-full grid place-items-center", compact ? "py-8" : "py-16")}>
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full border grid place-items-center text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium">No audit events</p>
        <p className="text-xs text-muted-foreground">Try widening the date range or clearing filters.</p>
      </div>
    </div>
  );
}

function MobileAuditCard({ row }: { row: AuditRow }) {
  return (
    <div className="rounded-xl border p-3 bg-card">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{format(new Date(row.ts), "yyyy-MM-dd HH:mm:ss")}</div>
        {statusBadge(row.status)}
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-between">
        <div className="font-medium">{row.service}</div>
        {severityBadge(row.severity)}
      </div>
      <div className="mt-1 text-muted-foreground">{row.action}</div>
      <div className="mt-1 text-xs text-muted-foreground">{row.actor}</div>
      <div className="mt-2 font-mono text-[11px] text-muted-foreground">{row.resource}</div>
      {row.details && <div className="mt-2 text-sm text-muted-foreground">{row.details}</div>}
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-3 bg-card">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DateRangePicker({
  from, to, onChange,
}: { from: Date | null; to: Date | null; onChange: (x: { from: Date | null; to: Date | null }) => void }) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<{ from: Date | null; to: Date | null }>({ from, to });

  React.useEffect(() => {
    setRange({ from, to });
  }, [from, to]);

  function apply() {
    onChange(range);
    setOpen(false);
  }

  function clear() {
    setRange({ from: null, to: null });
    onChange({ from: null, to: null });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[220px] justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "yyyy-MM-dd")} — {format(range.to, "yyyy-MM-dd")}
              </>
            ) : (
              format(range.from, "yyyy-MM-dd")
            )
          ) : (
            <span>Date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="grid gap-2">
          <div className="text-sm font-medium">From</div>
          <Calendar
            mode="single"
            selected={range.from ?? undefined}
            onSelect={(d) => setRange(prev => ({ ...prev, from: d ?? null }))}
            initialFocus
          />
          <Separator />
          <div className="text-sm font-medium pt-1">To</div>
          <Calendar
            mode="single"
            selected={range.to ?? undefined}
            onSelect={(d) => setRange(prev => ({ ...prev, to: d ?? null }))}
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
            <Button size="sm" onClick={apply}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
