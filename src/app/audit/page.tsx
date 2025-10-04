
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Filter, Download, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2, ShieldAlert, CheckCircle2, CircleHelp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { auditLogs, type AuditEvent } from "@/lib/data";

// ---------- Types ----------
type Severity = AuditEvent['severity'];
type Status = AuditEvent['result'];

// ---------- Config ----------
const PAGE_SIZE = 20;

// ---------- Helpers ----------
function severityBadge(sev: Severity) {
  const map: Record<Severity, { variant: "default" | "secondary" | "destructive"; icon: React.ReactNode; className?: string }> = {
    info: { variant: "secondary", icon: <CircleHelp className="h-3.5 w-3.5 mr-1.5" />, className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700"},
    warn: { variant: "default", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700" },
    error: { variant: "destructive", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />, className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700" },
    critical: { variant: "destructive", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />, className: "bg-fuchsia-200 text-fuchsia-900 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700 font-bold" },
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
    fail: { className: "bg-rose-50 text-rose-700 border border-rose-200", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> },
  };
  const x = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", x.className)}>
      {x.icon}
      {status}
    </span>
  );
}

function toCSV(rows: AuditEvent[]) {
  const header = ["Timestamp","Service","Action", "Actor ID", "Actor Type", "Actor Name", "Actor Email","Status","Severity","Resource Type", "Resource ID", "Resource Name"];
  const body = rows.map(r => [
    r.ts,
    r.service,
    r.action,
    r.actor.id,
    r.actor.type,
    r.actor.name || '',
    r.actor.email || '',
    r.result,
    r.severity,
    r.resource?.type || '',
    r.resource?.id || '',
    r.resource?.name || '',
  ]);
  const csv = [header, ...body].map(line => line.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

// ---------- Data fetching ----------
async function fetchAudits(
  page: number,
  pageSize: number,
  q: string,
  filters: { severity?: Severity | "all"; status?: Status | "all"; service?: string | "all"; from?: Date | null; to?: Date | null; }
): Promise<{ rows: AuditEvent[]; total: number; }> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 400));
  
  let rows = [...auditLogs];

  // Filter client-side for demo
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(r =>
      r.service.toLowerCase().includes(qq) ||
      r.action.toLowerCase().includes(qq) ||
      r.actor.id.toLowerCase().includes(qq) ||
      (r.actor.name || '').toLowerCase().includes(qq) ||
      (r.actor.email || '').toLowerCase().includes(qq) ||
      (r.resource?.id || '').toLowerCase().includes(qq) ||
      (r.resource?.name || '').toLowerCase().includes(qq)
    );
  }
  if (filters.severity && filters.severity !== "all") rows = rows.filter(r => r.severity === filters.severity);
  if (filters.status && filters.status !== "all") rows = rows.filter(r => r.result === filters.status);
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
  const [rows, setRows] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  // derive
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const serviceOptions = React.useMemo(() => [...new Set(auditLogs.map(log => log.service))], []);

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

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-4 border bg-card">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              aria-label="Search audit"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search service, action, actor, resource..."
              className="pl-8"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Severity */}
            <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>

            {/* Service */}
            <Select value={service} onValueChange={(v: any) => setService(v)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <DateRangePicker from={from} to={to} onChange={({ from, to }) => { setFrom(from); setTo(to); }} />

            <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center">
              <X className="h-4 w-4 mr-1 md:hidden" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Events (page)" value={loading ? "—" : rows.length.toString()} hint="Current page count" />
        <KpiCard title="Total (filtered)" value={loading ? "—" : total.toString()} hint="Across all pages" />
        <KpiCard title="Critical (page)" value={loading ? "—" : rows.filter(r => r.severity === "critical").length.toString()} hint="High priority" />
        <KpiCard title="Failed (page)" value={loading ? "—" : rows.filter(r => r.result === "fail").length.toString()} hint="Needs attention" />
      </div>

      {/* Data area */}
      <Card>
        <CardContent className="p-0">
            {/* Mobile cards */}
            <div className="md:hidden">
              <ScrollArea className="h-[calc(100vh-28rem)] pr-3">
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
                        <TableHead>Actor</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Env</TableHead>
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
                              {format(parseISO(r.ts), "yyyy-MM-dd HH:mm:ss")}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{r.actor.name || r.actor.id}</div>
                                <div className="text-xs text-muted-foreground">{r.actor.email || r.actor.type}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{r.action}</div>
                                <div className="text-xs text-muted-foreground">{r.service}</div>
                            </TableCell>
                            <TableCell>
                                {r.resource && (
                                  <>
                                    <div className="font-medium">{r.resource.name || r.resource.id}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{r.resource.type}</div>
                                  </>
                                )}
                            </TableCell>
                            <TableCell>{statusBadge(r.result)}</TableCell>
                            <TableCell>{severityBadge(r.severity)}</TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{r.env}</Badge></TableCell>
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
          </CardContent>
        </Card>
      </div>
  );
}

// ---------- Subcomponents ----------
function KpiCard(props: { title: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight">{props.value}</div>
        {props.hint && <div className="text-xs text-muted-foreground mt-1">{props.hint}</div>}
      </CardContent>
    </Card>
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

function MobileAuditCard({ row }: { row: AuditEvent }) {
  return (
    <div className="rounded-xl border p-3 bg-card">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{format(parseISO(row.ts), "yyyy-MM-dd HH:mm:ss")}</div>
        {statusBadge(row.result)}
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-between">
        <div className="font-medium">{row.action} on <span className="text-muted-foreground">{row.service}</span></div>
        {severityBadge(row.severity)}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">by <span className="font-medium text-foreground">{row.actor.name || row.actor.id}</span></div>
      
      {row.resource && (
        <div className="mt-2 font-mono text-[11px] text-muted-foreground bg-muted p-2 rounded-md">
          <p className="font-semibold text-foreground">{row.resource.type}</p>
          {row.resource.name} ({row.resource.id})
        </div>
      )}
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-3 p-4">
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
            <Skeleton className="h-10 w-full" />
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
        <Button variant="outline" size="sm" className="w-full sm:w-[220px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
              </>
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span>Date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
            initialFocus
            mode="range"
            defaultMonth={from ?? new Date()}
            selected={{ from: range.from!, to: range.to! }}
            onSelect={(range) => setRange({ from: range?.from ?? null, to: range?.to ?? null })}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-end gap-2 p-3 border-t">
            <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
            <Button size="sm" onClick={apply}>Apply</Button>
          </div>
      </PopoverContent>
    </Popover>
  );
}

    