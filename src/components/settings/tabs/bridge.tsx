
"use client";

import { BridgeConfigCard } from "@/components/settings/bridge-config-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { date: "2024-05-01", latency: 120 },
  { date: "2024-05-02", latency: 110 },
  { date: "2024-05-03", latency: 115 },
  { date: "2024-05-04", latency: 130 },
  { date: "2024-05-05", latency: 125 },
  { date: "2024-05-06", latency: 140 },
  { date: "2024-05-07", latency: 135 },
];

const chartConfig = {
  latency: {
    label: "Latency (ms)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function SettingsBridgeTab() {
  return (
    <div className="space-y-6">
      <BridgeConfigCard />
      <Card>
        <CardHeader>
          <CardTitle>Health & Metrics</CardTitle>
          <CardDescription>P95 latency over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short'})}
                        />
                         <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <Tooltip 
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />} 
                        />
                        <Bar dataKey="latency" fill="var(--color-latency)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
