
export type Service = {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  performance: number[];
  icon: string;
  tags: string[];
  lastSuccess: string;
  runCount: number;
  p95_ms: number;
  err_rate_pct: number;
  rps: number;
  commit: string;
};

export type AuditEvent = {
  id: string;
  ts: string;
  env: 'dev'|'stg'|'prod';
  service: string;
  tool: string;
  action: string;
  actor: { id: string; type: 'user'|'service'|'automation'; email?: string; name?: string };
  source: 'UI'|'API'|'CLI'|'Automation';
  resource?: { type: string; id: string; name?: string; path?: string };
  session?: string;
  severity: 'info'|'warn'|'error'|'critical';
  result: 'success'|'fail';
  latency_ms?: number;
  cost_usd?: number;
  policy?: { rbac?: 'allow'|'deny'; spend_cap?: 'ok'|'blocked'; maintenance?: 'window'|'none' };
  network?: { ip?: string; ua?: string; region?: string };
  tags?: string[];
  diff?: { before?: unknown; after?: unknown };
  integrity: { signed: boolean; signer?: string; sig?: string; hash: string; prev_hash?: string; merkle_root?: string };
  raw: unknown;
};

export const kpis = [
  { title: "Uptime", value: "99.98%", change: "+0.02%", description: "last 24h", status: "success" as const },
  { title: "Latency", value: "121ms", change: "-8ms", description: "p95, last 1h", status: "success" as const },
  { title: "Errors", value: "0.12%", change: "+0.05%", description: "last 1h", status: "warning" as const },
  { title: "CPU", value: "78%", change: "+12%", description: "system-wide", status: "destructive" as const },
  { title: "Incidents", value: "2", change: "+1", description: "active", status: "destructive" as const },
  { title: "Bridge", value: "Online", description: "last check 2m ago", status: "success" as const },
  { title: "Commits", value: "432", description: "today", status: "neutral" as const },
];

export const operationsTimelineData = [
  { time: '0', success: 18, failure: 2 },
  { time: '-5m', success: 22, failure: 3 },
  { time: '-10m', success: 30, failure: 5 },
  { time: '-15m', success: 25, failure: 4 },
  { time: '-20m', success: 35, failure: 12 },
  { time: '-25m', success: 32, failure: 7 },
  { time: '-30m', success: 28, failure: 5 },
  { time: '-35m', success: 40, failure: 6 },
  { time: '-40m', success: 45, failure: 8 },
  { time: '-45m', success: 42, failure: 15 },
  { time: '-50m', success: 38, failure: 10 },
  { time: '-55m', success: 35, failure: 8 },
];

export const copilotSuggestions = [
    { id: 'cs1', title: 'Onboarding progress', subtext: '3/5 steps complete', cta: 'Continue', status: 'info' as const },
    { id: 'cs2', title: 'Bridge token', subtext: 'Last test failed', cta: 'Fix', status: 'warning' as const },
];
