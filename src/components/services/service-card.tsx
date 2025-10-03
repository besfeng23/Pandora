"use client";

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
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ServiceIcon } from "./service-icon";

type ServiceCardProps = {
  service: Service;
};

const statusClasses = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-gray-400",
};

const chartConfig = {
  performance: {
    color: "hsl(var(--primary))",
  },
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
             <ServiceIcon name={service.icon} className="h-6 w-6 text-muted-foreground" />
             <CardTitle className="text-lg font-headline font-semibold">{service.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", statusClasses[service.status])} />
            <span className="text-sm capitalize text-muted-foreground">{service.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-16 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={service.performance.map((value, index) => ({ index, value }))}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                    <Line
                    dataKey="value"
                    type="monotone"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    />
                </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2 pt-4">
        {service.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-lg">{tag}</Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
