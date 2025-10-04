
"use client";

import { notFound, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/components/services/service-icon";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/lib/data-types";


const statusClasses = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-gray-400",
};

const chartConfig = {
  performance: {
    label: "ms",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ServiceDetailPage() {
  const params = useParams();
  const firestore = useFirestore();
  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const serviceRef = doc(firestore, "services", serviceId);
  const { data: service, isLoading } = useDoc<Service>(serviceRef);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-12">
        <div className="col-span-12 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        <Card className="col-span-12 rounded-2xl shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64" />
          </CardContent>
        </Card>
        <div className="col-span-12 md:col-span-6">
          <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!service) {
    notFound();
  }
  
  const chartData = service.performance.map((value, index) => ({ name: `T-${service.performance.length - index}`, performance: value }));

  return (
    <div className="grid gap-6 md:grid-cols-12">
       <div className="col-span-12 flex items-center gap-4">
        <ServiceIcon name={service.icon} className="h-10 w-10 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
            {service.name}
            <span className={cn("h-4 w-4 rounded-full", statusClasses[service.status])} />
          </h1>
          <p className="text-muted-foreground capitalize">{service.status}</p>
        </div>
      </div>
      
      <Card className="col-span-12 rounded-2xl shadow-lg">
        <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Response time over the last hour.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-64">
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: '' }}/>
                            <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </CardContent>
      </Card>

      <div className="col-span-12 md:col-span-6">
        <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
                <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-semibold">Service ID</p>
                    <p className="text-muted-foreground font-mono">{service.id}</p>
                </div>
                 <div>
                    <p className="font-semibold">Last Success</p>
                    <p className="text-muted-foreground">{service.lastSuccess}</p>
                </div>
                 <div>
                    <p className="font-semibold">Run Count</p>
                    <p className="text-muted-foreground">{service.runCount.toLocaleString()}</p>
                </div>
            </CardContent>
             <CardFooter>
                <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-lg">{tag}</Badge>
                    ))}
                </div>
            </CardFooter>
        </Card>
      </div>
      <div className="col-span-12 md:col-span-6">
        <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
                <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">No recent events to display.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    