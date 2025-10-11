
"use client";

import { useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { SystemHealth } from "@/lib/data-types";
import KpiCard from "./kpi-card";
import { Skeleton } from "../ui/skeleton";

const staticKpis = [
    { title: 'System', value: 'Healthy', change: '', description: 'All systems operational', status: 'success' as const },
    { title: 'Active Ops', value: '0', change: '', description: 'Concurrent tool runs', status: 'neutral' as const },
    { title: 'Failures', value: '0', change: '', description: 'Past 24 hours', status: 'neutral' as const },
    { title: 'Uptime', value: '100%', change: '', description: 'Last 30 days', status: 'success' as const },
    { title: 'Avg. Latency', value: '128ms', change: '+3.2%', description: 'p95 response time', status: 'warning' as const },
    { title: 'CPU Usage', value: '58%', change: '-1.5%', description: 'Cluster-wide average', status: 'neutral' as const },
    { title: 'Incidents', value: '2', change: '', description: 'Currently active', status: 'destructive' as const },
];

export default function HealthOverview() {
  const firestore = useFirestore();

  const healthQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'systemHealth'), orderBy('timestamp', 'desc'), limit(1));
  }, [firestore]);

  const { data: healthData, isLoading } = useCollection<SystemHealth>(healthQuery);
  
  const latestHealth = useMemo(() => healthData?.[0], [healthData]);

  const kpis = useMemo(() => {
    if (!latestHealth) {
      return staticKpis;
    }
    
    return staticKpis.map(kpi => {
        switch (kpi.title) {
            case 'System':
                if (latestHealth.healthy) return { ...kpi, value: 'Healthy', status: 'success' as const, description: 'All systems operational' };
                if (latestHealth.degraded) return { ...kpi, value: 'Degraded', status: 'warning' as const, description: 'Some services impacted' };
                if (latestHealth.down) return { ...kpi, value: 'Down', status: 'destructive' as const, description: 'Critical services offline' };
                return { ...kpi, value: 'Unknown', status: 'neutral' as const, description: 'Status could not be determined' };
            case 'Active Ops':
                return { ...kpi, value: latestHealth.activeOperations.toString() };
            case 'Failures':
                return { ...kpi, value: latestHealth.failures.toString() };
            case 'Uptime':
                const uptimePercentage = Math.min(100, (latestHealth.uptime / (30 * 24 * 60 * 60)) * 100);
                return { ...kpi, value: `${uptimePercentage.toFixed(2)}%` };
            default:
                return kpi;
        }
    });
  }, [latestHealth]);

  if (isLoading && !kpis.length) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {Array.from({length: 7}).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
