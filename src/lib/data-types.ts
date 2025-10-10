

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

export type UserProfile = {
  id: string;
  name?: string;
  email: string;
  roleId?: string;
  avatar?: string;
  lastActive?: string;
};

export type Role = {
  id: string;
  name: string;
  permissions: string[];
};

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

    
