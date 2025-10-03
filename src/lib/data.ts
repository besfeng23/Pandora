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
  { title: "Uptime", value: "99.98%", change: "+0.02%", status: "success" as const, description: "24h" },
  { title: "Healthy", value: "62/64", change: "", status: "success" as const, description: "Services" },
  { title: "Degraded", value: "1", change: "", status: "warning" as const, description: "Services" },
  { title: "Down", value: "1", change: "", status: "destructive" as const, description: "Services" },
  { title: "Active Ops", value: "1.2k", change: "+15%", status: "success" as const, description: "per minute" },
  { title: "Failures", value: "0.1%", change: "-0.05%", status: "success" as const, description: "per minute" },
  { title: "Connected", value: "12", change: "", status: "neutral" as const, description: "Services" },
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
};

export const services: Service[] = [
  { id: "svc-1", name: "Auth Service", status: "healthy", performance: [5, 6, 5, 7, 8, 6, 7, 8, 9, 10], icon: "ShieldCheck", tags: ['auth', 'core'], lastSuccess: '2m ago', runCount: 1250 },
  { id: "svc-2", name: "Billing API", status: "healthy", performance: [8, 9, 8, 10, 9, 8, 7, 8, 9, 10], icon: "Database", tags: ['billing', 'api'], lastSuccess: '1m ago', runCount: 3420 },
  { id: "svc-3", name: "User Profiles", status: "degraded", performance: [10, 9, 12, 15, 13, 16, 18, 15, 14, 12], icon: "Users", tags: ['user', 'db'], lastSuccess: '15m ago', runCount: 890 },
  { id: "svc-4", name: "Content Processor", status: "healthy", performance: [3, 4, 3, 5, 4, 3, 4, 5, 6, 5], icon: "Cpu", tags: ['media', 'worker'], lastSuccess: '5m ago', runCount: 540 },
  { id: "svc-5", name: "Realtime Analytics", status: "down", performance: [20, 22, 25, 30, 28, 32, 40, 55, 60, 0], icon: "Activity", tags: ['data', 'realtime'], lastSuccess: '1h ago', runCount: 2100 },
  { id: "svc-6", name: "Cloud Storage Gateway", status: "healthy", performance: [2, 3, 2, 3, 4, 3, 2, 3, 4, 3], icon: "Cloud", tags: ['storage', 'aws'], lastSuccess: '30s ago', runCount: 8765 },
  { id: "svc-7", name: "CI/CD Pipeline", status: "unknown", performance: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], icon: "Code", tags: ['devops', 'automation'], lastSuccess: '4h ago', runCount: 120 },
  { id: "svc-8", name: "Webhook Dispatcher", status: "healthy", performance: [1, 2, 1, 2, 1, 1, 2, 1, 2, 1], icon: "Webhook", tags: ['integration', 'events'], lastSuccess: '10s ago', runCount: 10987 },
  { id: "svc-9", name: "CLI Tool Runner", status: "healthy", performance: [4, 5, 4, 6, 5, 4, 5, 6, 7, 6], icon: "Terminal", tags: ['cli', 'tooling'], lastSuccess: '8m ago', runCount: 432 },
  { id: "svc-10", name: "Docs Generator", status: "healthy", performance: [7, 8, 7, 9, 8, 7, 8, 9, 10, 9], icon: "FileText", tags: ['docs', 'generator'], lastSuccess: '22m ago', runCount: 215 },
];


export type AuditLog = {
  id: string;
  event: string;
  user: string;
  severity: "info" | "warning" | "error" | "critical";
  timestamp: string;
  details: string;
};

export const auditLogs: AuditLog[] = [
  { id: "log-1", event: "tool.run", user: "alex@pandora.dev", severity: "info", timestamp: "2023-10-27T10:00:00Z", details: "Executed 'Restart Pod' on service 'Auth Service'" },
  { id: "log-2", event: "tool.fail", user: "system", severity: "error", timestamp: "2023-10-27T10:01:15Z", details: "Failed to run 'Scale Up' on 'Realtime Analytics': quota exceeded" },
  { id: "log-3", event: "favorite.add", user: "sara@pandora.dev", severity: "info", timestamp: "2023-10-27T10:02:30Z", details: "Added 'Flush Cache' to favorites" },
  { id: "log-4", event: "settings.bridge.test_clicked", user: "admin@pandora.dev", severity: "info", timestamp: "2023-10-27T10:05:00Z", details: "Bridge connection test initiated" },
  { id: "log-5", event: "service.view", user: "brian@pandora.dev", severity: "info", timestamp: "2023-10-27T10:05:45Z", details: "Viewed details for 'Billing API'" },
  { id: "log-6", event: "tool.run.dual_approval", user: "alex@pandora.dev", severity: "warning", timestamp: "2023-10-27T10:08:00Z", details: "Requested dual approval for 'Delete Production DB'" },
  { id: "log-7", event: "tool.run.approved", user: "sara@pandora.dev", severity: "critical", timestamp: "2023-10-27T10:09:10Z", details: "Approved execution of 'Delete Production DB'" },
  { id: "log-8", event: "settings.env_import.parse", user: "admin@pandora.dev", severity: "info", timestamp: "2023-10-27T10:11:00Z", details: "Parsed new .env file for staging environment" },
  { id: "log-9", event: "user.login.fail", user: "unknown", severity: "warning", timestamp: "2023-10-27T10:12:00Z", details: "Failed login attempt from IP 123.45.67.89" },
  { id: "log-10", event: "service.degraded", user: "system", severity: "warning", timestamp: "2023-10-27T10:15:00Z", details: "'User Profiles' service status changed to degraded" },
  { id: "log-11", event: "service.down", user: "system", severity: "error", timestamp: "2023-10-27T10:16:30Z", details: "'Realtime Analytics' service status changed to down" },
];
