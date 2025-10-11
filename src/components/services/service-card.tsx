
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/data-types";
import { ServiceIcon } from "./service-icon";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type ServiceCardProps = {
  service: Service;
};

const statusClasses = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function ServiceCard({
  service,
}: {
  service: Service;
}) {
  return (
    <article className="group h-full rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-ring flex flex-col">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-muted ring-1 ring-inset ring-border">
          <ServiceIcon name={service.icon} className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              <Link href={`/services/${service.id}`} className="align-middle stretched-link">
                {service.name}
              </Link>
            </h3>
            <div className={cn("size-2.5 shrink-0 rounded-full", statusClasses[service.status])} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {service.tags.join(', ')}
          </div>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div><div className="text-slate-400 dark:text-slate-500">p95</div><div className="font-medium">{service.p95_ms} ms</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">errors</div><div className="font-medium">{service.err_rate_pct}%</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">req/s</div><div className="font-medium">{service.rps}</div></div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
         <div className="text-[11px] text-muted-foreground">Commit <code className="font-mono">{service.commit.slice(0,7)}</code></div>
          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-input px-2.5 text-xs hover:bg-accent"
          >
            Manage
          </Link>
      </div>
    </article>
  );
}

    