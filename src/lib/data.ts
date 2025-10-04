
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

export const auditLogs: AuditEvent[] = [
  {
    id: "evt-1",
    ts: "2023-10-27T10:00:00Z",
    env: 'prod',
    service: 'Auth Service',
    tool: 'mcp-cli',
    action: 'restart_pod',
    actor: { id: 'user-alex', type: 'user', email: 'alex@pandora.dev', name: 'Alex' },
    source: 'CLI',
    resource: { type: 'pod', id: 'auth-service-7dbrg', name: 'auth-service-7dbrg' },
    session: 'session-xyz',
    severity: 'info',
    result: 'success',
    latency_ms: 120,
    integrity: { signed: true, hash: 'abc1' }
  },
  {
    id: "evt-2",
    ts: "2023-10-27T10:01:15Z",
    env: 'prod',
    service: 'Realtime Analytics',
    tool: 'mcp-autoscaler',
    action: 'scale_up',
    actor: { id: 'auto-scaler', type: 'automation', name: 'MCP Autoscaler' },
    source: 'Automation',
    resource: { type: 'deployment', id: 'realtime-analytics', name: 'realtime-analytics' },
    severity: 'error',
    result: 'fail',
    integrity: { signed: true, hash: 'abc2' },
    raw: { "reason": "quota exceeded" }
  },
  {
    id: "evt-3",
    ts: "2023-10-27T10:02:30Z",
    env: 'dev',
    service: 'pandora-ui',
    tool: 'user-settings',
    action: 'add_favorite',
    actor: { id: 'user-sara', type: 'user', email: 'sara@pandora.dev', name: 'Sara' },
    source: 'UI',
    resource: { type: 'favorite', id: 'fav-flush-cache' },
    severity: 'info',
    result: 'success',
    integrity: { signed: true, hash: 'abc3' }
  },
  {
    id: "evt-4",
    ts: "2023-10-27T10:05:00Z",
    env: 'prod',
    service: 'pandora-bridge',
    tool: 'settings-ui',
    action: 'test_connection',
    actor: { id: 'user-admin', type: 'user', email: 'admin@pandora.dev', name: 'Admin' },
    source: 'UI',
    severity: 'info',
    result: 'success',
    latency_ms: 88,
    integrity: { signed: true, hash: 'abc4' }
  },
  {
    id: "evt-5",
    ts: "2023-10-27T10:09:10Z",
    env: 'prod',
    service: 'Production DB',
    tool: 'mcp-cli',
    action: 'delete_database',
    actor: { id: 'user-sara', type: 'user', email: 'sara@pandora.dev', name: 'Sara' },
    source: 'CLI',
    severity: 'critical',
    result: 'success',
    policy: { rbac: 'allow' },
    integrity: { signed: true, hash: 'abc5' }
  },
  {
    id: "evt-6",
    ts: "2023-10-27T10:12:00Z",
    env: 'prod',
    service: 'auth-service',
    tool: 'login-proxy',
    action: 'user_login',
    actor: { id: 'unknown', type: 'user' },
    source: 'API',
    severity: 'warn',
    result: 'fail',
    network: { ip: '123.45.67.89' },
    integrity: { signed: false, hash: 'abc6' }
  }
];


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


// --- Connections Page v3 Data ---

export type Connection = {
  id: string;
  providerId: string;
  name: string;
  env: 'dev' | 'staging' | 'prod';
  status: 'active' | 'warning' | 'error' | 'pending' | 'paused';
  health: {
    lastSync: string;
    latencyP95: number;
    error24h: number;
    quotaUsedPct: number;
  };
  scopes: string[];
  secretRef: string;
  usage7d: number[];
  icon: string;
};

const now = new Date();

export const connectionData: Connection[] = [
    {
        id: 'conn-github',
        providerId: 'github',
        name: 'GitHub',
        env: 'prod',
        status: 'active',
        health: {
            lastSync: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 mins ago
            latencyP95: 120,
            error24h: 2,
            quotaUsedPct: 15,
        },
        scopes: ['repo', 'user', 'admin:org'],
        secretRef: 'vault:github-prod-key',
        usage7d: [100, 120, 110, 130, 150, 140, 160],
        icon: 'Github',
    },
    {
        id: 'conn-notion-dev',
        providerId: 'notion',
        name: 'Notion (Dev)',
        env: 'dev',
        status: 'pending',
        health: {
            lastSync: '',
            latencyP95: 0,
            error24h: 0,
            quotaUsedPct: 0,
        },
        scopes: ['pages:read', 'users:read'],
        secretRef: '',
        usage7d: [0, 0, 0, 0, 0, 0, 0],
        icon: 'Notion',
    }
];

export const quickConnectProviders = [
    { id: 'notion', name: 'Notion', icon: 'Notion'},
    { id: 'linear', name: 'Linear', icon: 'Blocks'},
    { id: 'github', name: 'GitHub', icon: 'Github'},
    { id: 'slack', name: 'Slack', icon: 'Slack'},
    { id: 'gcp', name: 'GCP', icon: 'Cloud'},
    { id: 'openai', name: 'OpenAI', icon: 'Bot' },
    { id: 'stripe', name: 'Stripe', icon: 'CreditCard' },
    { id: 'box', name: 'Box', icon: 'Box' },
]

