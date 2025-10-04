
import type { SVGProps } from "react";
import { 
  Server, 
  Database, 
  Cloud, 
  Code, 
  Activity, 
  ShieldCheck, 
  Users, 
  Webhook, 
  Cpu, 
  Terminal,
  FileText
} from 'lucide-react';

export const kpis = [
  { title: "Uptime", value: "99.98%", description: "last 30d", change: "+0.02%", status: "success" as const },
  { title: "Healthy", value: "62/64", description: "SLO > 99.9%", change: "", status: "success" as const },
  { title: "Degraded", value: "1", description: "p95 > 300ms", change: "", status: "warning" as const },
  { title: "Down", value: "1", description: "Error rate > 5%", change: "", status: "destructive" as const },
  { title: "Active Ops", value: "1.2k", description: "per minute", change: "+15%", status: "success" as const },
  { title: "Failures", value: "0.1%", description: "per minute", change: "-0.05%", status: "success" as const },
  { title: "Connected", value: "12", description: "Services", change: "", status: "neutral" as const },
];

export const operationsTimelineData = [
  { time: "12:00", success: 400, failure: 20 },
  { time: "12:05", success: 300, failure: 10 },
  { time: "12:10", success: 200, failure: 5 },
  { time: "12:15", success: 278, failure: 8 },
  { time: "12:20", success: 189, failure: 3 },
  { time: "12:25", success: 239, failure: 12 },
  { time: "12:30", success: 349, failure: 2 },
  { time: "12:35", success: 450, failure: 15 },
  { time: "12:40", success: 380, failure: 7 },
  { time: "12:45", success: 410, failure: 4 },
  { time: "12:50", success: 420, failure: 9 },
  { time: "12:55", success: 390, failure: 1 },
];

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

export const services: Service[] = [
  { id: "svc-1", name: "Auth Service", status: "healthy", performance: [5, 6, 5, 7, 8, 6, 7, 8, 9, 10], icon: "ShieldCheck", tags: ['auth', 'core'], lastSuccess: '2m ago', runCount: 1250, p95_ms: 88, err_rate_pct: 0.1, rps: 120, commit: "a8b3c1d" },
  { id: "svc-2", name: "Billing API", status: "healthy", performance: [8, 9, 8, 10, 9, 8, 7, 8, 9, 10], icon: "Database", tags: ['billing', 'api'], lastSuccess: '1m ago', runCount: 3420, p95_ms: 120, err_rate_pct: 0.05, rps: 340, commit: "f2e9g4h" },
  { id: "svc-3", name: "User Profiles", status: "degraded", performance: [10, 9, 12, 15, 13, 16, 18, 15, 14, 12], icon: "Users", tags: ['user', 'db'], lastSuccess: '15m ago', runCount: 890, p95_ms: 450, err_rate_pct: 1.2, rps: 80, commit: "k5l6m7n" },
  { id: "svc-4", name: "Content Processor", status: "healthy", performance: [3, 4, 3, 5, 4, 3, 4, 5, 6, 5], icon: "Cpu", tags: ['media', 'worker'], lastSuccess: '5m ago', runCount: 540, p95_ms: 55, err_rate_pct: 0, rps: 50, commit: "p9q8r7s" },
  { id: "svc-5", name: "Realtime Analytics", status: "down", performance: [20, 22, 25, 30, 28, 32, 40, 55, 60, 0], icon: "Activity", tags: ['data', 'realtime'], lastSuccess: '1h ago', runCount: 2100, p95_ms: 2100, err_rate_pct: 15.3, rps: 2, commit: "t1u2v3w" },
  { id: "svc-6", name: "Cloud Storage Gateway", status: "healthy", performance: [2, 3, 2, 3, 4, 3, 2, 3, 4, 3], icon: "Cloud", tags: ['storage', 'aws'], lastSuccess: '30s ago', runCount: 8765, p95_ms: 30, err_rate_pct: 0.01, rps: 900, commit: "x4y5z6a" },
  { id: "svc-7", name: "CI/CD Pipeline", status: "unknown", performance: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], icon: "Code", tags: ['devops', 'automation'], lastSuccess: '4h ago', runCount: 120, p95_ms: 0, err_rate_pct: 0, rps: 0, commit: "b7c8d9e" },
  { id: "svc-8", name: "Webhook Dispatcher", status: "healthy", performance: [1, 2, 1, 2, 1, 1, 2, 1, 2, 1], icon: "Webhook", tags: ['integration', 'events'], lastSuccess: '10s ago', runCount: 10987, p95_ms: 12, err_rate_pct: 0, rps: 1500, commit: "f0g1h2i" },
  { id: "svc-9", name: "CLI Tool Runner", status: "healthy", performance: [4, 5, 4, 6, 5, 4, 5, 6, 7, 6], icon: "Terminal", tags: ['cli', 'tooling'], lastSuccess: '8m ago', runCount: 432, p95_ms: 65, err_rate_pct: 0.2, rps: 45, commit: "j3k4l5m" },
  { id: "svc-10", name: "Docs Generator", status: "healthy", performance: [7, 8, 7, 9, 8, 7, 8, 9, 10, 9], icon: "FileText", tags: ['docs', 'generator'], lastSuccess: '22m ago', runCount: 215, p95_ms: 95, err_rate_pct: 0, rps: 10, commit: "n6p7q8r" },
];


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

export const auditLogs: AuditEvent[] = Array.from({ length: 137 }, (_, i) => {
    const services = ["Orchestrator", "Adapter", "Compliance Logger", "Health Check", "FX Rate", "Studio", "Partner Mgmt"];
    const actions = ["CREATE", "POLL", "FLAG", "RUNBOOK", "SYNC", "APPROVE", "EXPORT", "REJECT"];
    const actors = [{ id: "system", type: "automation", name: "system" }, { id: "eve@edenos", type: "user", email: "eve@edenos", name: "Eve" }, { id: "admin@redapplex", type: "user", email: "admin@redapplex", name: "Admin" }];
    const statuses: AuditEvent['result'][] = ["success", "fail", "pending" as any]; // pending is not a real status
    const severities: AuditEvent['severity'][] = ["info", "warn", "error", "critical"];

    const date = new Date();
    date.setHours(date.getHours() - i);
    date.setMinutes(date.getMinutes() - (i * 7));
    date.setSeconds(date.getSeconds() - (i * 13));

    const result: AuditEvent['result'] = i % 2 === 0 ? 'success' : 'fail';

    return {
        id: `evt-${100000 + i}`,
        ts: date.toISOString(),
        env: 'prod',
        service: services[i % services.length],
        tool: 'mcp-cli',
        action: actions[i % actions.length],
        actor: actors[i % actors.length],
        source: 'CLI',
        resource: { type: 'transaction', id: `txn/${100000 + i}` },
        severity: severities[i % severities.length],
        result: result,
        latency_ms: 50 + Math.floor(Math.random() * 200),
        raw: { details: result === 'success' ? "Periodic health ping." : "Latency above SLO for FX quotes." },
        integrity: { signed: true, hash: `hash-${i}`, prev_hash: `hash-${i-1}` },
    };
});


// --- Connections Page Data ---

export type Env = "dev" | "staging" | "prod";
export type Status = "active" | "warning" | "error" | "pending" | "paused";
export type Provider = {
  id: string;
  name: string;
  category: "dev" | "cloud" | "billing" | "docs" | "chat" | "db";
  recommendedScopes?: string[];
};
export type Health = {
  lastSyncISO?: string;
  latencyP95?: number;
  error24h?: number;
  quotaUsedPct?: number;
};
export type TestResult = { name: string; pass: boolean; fixAction?: FixId };
export type FixId = | "reauth" | `add_scope:${string}` | "rotate_secret" | "replay_webhook" | "lower_rate" | "upgrade_plan";
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

export const seedConnections: Connection[] = [
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

// In-memory helpers for fake API
const _mem: Record<string, Connection> = Object.fromEntries(seedConnections.map((c) => [c.id, c]));
function getConn(id: string) { return _mem[id]; }
function setConn(c: Connection) { _mem[c.id] = c; return c; }
function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
export function upsertConn(arr: Connection[], c: Connection) {
  const i = arr.findIndex((x) => x.id === c.id);
  if (i === -1) return [...arr, c];
  const next = [...arr];
  next[i] = c;
  return next;
}

export const connectionsApi = {
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
    return setConn(base);
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
    return setConn({ ...conn, secretRef: `vault://secrets/${conn.providerId}-${env}?rotated=${Date.now()}`, lastRotatedISO: new Date().toISOString() });
  },
  async pause(id: string): Promise<Connection> {
    await sleep(200);
    const conn = getConn(id);
    return setConn({ ...conn, status: 'paused' });
  },
  async resume(id: string): Promise<Connection> {
    await sleep(400);
    return this.runAutoTests(id);
  }
};


// --- Settings Page Data ---

export type IntegrationStatus = 'healthy' | 'degraded' | 'active' | 'disconnected' | 'needs_attention';
export type Integration = {
  id: string;
  name: string;
  logo: string;
  status: IntegrationStatus;
  lastPingAt: string;
  latencyP95Ms: number;
  errorRate: number;
  sparkline: number[];
  hasWebhook?: boolean;
  baseUrl?: string;
};

export const integrations: Integration[] = [
  { id: "github", name: "GitHub", logo: "Github", status: "healthy", lastPingAt: "2025-10-02T10:32:00Z", latencyP95Ms: 180, errorRate: 0.003, sparkline: [10, 20, 15, 25, 30, 22, 28], hasWebhook: true, baseUrl: "https://api.github.com" },
  { id: "openai", name: "OpenAI", logo: "Openai", status: "degraded", lastPingAt: "2025-10-02T10:30:00Z", latencyP95Ms: 600, errorRate: 0.02, sparkline: [50, 60, 55, 70, 80, 75, 90] },
  { id: "gcp", name: "Gcp", logo: "Gcp", status: "degraded", lastPingAt: "2025-10-02T10:31:00Z", latencyP95Ms: 1200, errorRate: 0.05, sparkline: [100, 120, 110, 130, 150, 140, 160] },
  { id: "linear", name: "Linear", logo: "Linear", status: "active", lastPingAt: "2025-10-02T10:32:00Z", latencyP95Ms: 120, errorRate: 0, sparkline: [5, 10, 8, 12, 15, 10, 13] },
  { id: "firebase", name: "Firebase", logo: "Firebase", status: "disconnected", lastPingAt: "2025-10-01T10:00:00Z", latencyP95Ms: 0, errorRate: 1, sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: "neon", name: "Neon", logo: "Neon", status: "disconnected", lastPingAt: "2025-10-01T12:00:00Z", latencyP95Ms: 0, errorRate: 1, sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: "notion", name: "Notion", logo: "Notion", status: "degraded", lastPingAt: "2025-10-02T10:25:00Z", latencyP95Ms: 800, errorRate: 0.08, sparkline: [70, 80, 75, 90, 100, 95, 110] },
];

export const copilotSuggestions = [
    { id: "sug-1", title: "Rotate API Key for GitHub", subtext: "Rotation suggested", status: "info" as const, cta: "Apply" },
    { id: "sug-2", title: "Reconnect Notion", subtext: "Invalid credentials", status: "warning" as const, cta: "Fix" },
];

export type ConnectionStatus = {
    label: string;
    status: 'ok' | 'error';
};

export const connectionStatuses: ConnectionStatus[] = [
    { label: "Auth keys defined", status: "ok" },
    { label: "Email sender connected", status: "ok" },
    { label: "Database accessible", status: "ok" },
];

export type SettingsAuditItem = {
    id: string;
    title: string;
    severity: 'info' | 'warning';
    timestamp: string;
};

export const settingsAuditLog: SettingsAuditItem[] = [
    { id: "audit-1", title: "Operation restarted", severity: "info", timestamp: "2025-10-03T01:22:00Z" },
    { id: "audit-2", title: "Scaling event triggered", severity: "info", timestamp: "2025-10-02T18:30:00Z" },
    { id: "audit-3", title: "Key rotated", severity: "info", timestamp: "2025-10-01T10:00:00Z" },
    { id: "audit-4", title: "Service removed", severity: "warning", timestamp: "2025-10-02T15:45:00Z" },
];


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

export const systemKpis = [
    { title: "Uptime", value: "99.99%", footer: "last 24h" },
    { title: "Integrations", value: "7 Active", footer: "2 need attention" },
    { title: "Failing Pings", value: "2", footer: "GCP, OpenAI" },
    { title: "Spend Est.", value: "$1,234", footer: "+5% vs last month" },
]

    