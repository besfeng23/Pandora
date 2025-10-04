
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
import type { Service } from "@/lib/data";
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

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`} className="flex">
      <button className="group rounded-xl border p-4 text-left w-full hover:border-slate-300 hover:shadow-lg transition-all anim-lift anim-tap">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", statusClasses[service.status])} />
            <span className="font-semibold">{service.name}</span>
          </div>
          <code className="rounded bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-500 dark:text-slate-400">{service.commit?.slice(0,7)}</code>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div><div className="text-slate-400 dark:text-slate-500">p95</div><div className="font-medium">{service.p95_ms} ms</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">errors</div><div className="font-medium">{service.err_rate_pct}%</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">req/s</div><div className="font-medium">{service.rps}</div></div>
        </div>
      </button>
    </Link>
  );
}

    