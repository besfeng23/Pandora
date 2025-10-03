
"use client";

import { services, type Service } from "@/lib/data";
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const statusClasses = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function ServiceDetailPage() {
  const params = useParams();
  const service = services.find((s) => s.id === params.id);

  if (!service) {
    notFound();
  }
  
  const chartData = service.performance.map((value, index) => ({ name: `T-${service.performance.length - index}`, value }));

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <ServiceIcon name={service.icon} className="h-10 w-10 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
            {service.name}
            <span className={cn("h-4 w-4 rounded-full", statusClasses[service.status])} />
          </h1>
          <p className="text-muted-foreground capitalize">{service.status}</p>
        </div>
      </div>
      
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Response time over the last hour.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: '' }}/>
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg">
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
        <Card className="rounded-2xl shadow-lg">
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
