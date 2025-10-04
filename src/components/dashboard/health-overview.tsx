
"use client";

import { useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { SystemHealth } from "@/lib/data-types";
import { kpis as staticKpis } from "@/lib/data";
import KpiCard from "./kpi-card";

export default function HealthOverview() {
  const firestore = useFirestore();

  const healthQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'systemHealth'), orderBy('timestamp', 'desc'), limit(1));
  }, [firestore]);

  const { data: healthData, isLoading } = useCollection<SystemHealth>(healthQuery);
  
  const latestHealth = useMemo(() => healthData?.[0], [healthData]);

  const kpis = useMemo(() => {
    const liveKpis = [...staticKpis];
    if (latestHealth) {
      const uptimeKpi = liveKpis.find(k => k.title === 'Uptime');
      if (uptimeKpi) {
        uptimeKpi.value = `${(latestHealth.uptime / (latestHealth.uptime + 1) * 100).toFixed(2)}%`;
      }
    }
    return liveKpis;
  }, [latestHealth]);

  if (isLoading && !kpis.length) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {Array.from({length: 7}).map((_, i) => <div key={i} className="h-24 w-full rounded-2xl bg-muted animate-pulse" />)}
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
