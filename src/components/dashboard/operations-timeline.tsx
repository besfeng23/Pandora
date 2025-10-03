"use client";

import { Bar, BarChart, Line, LineChart, ReferenceDot, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { operationsTimelineData } from "@/lib/data";

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-1))",
  },
  failure: {
    label: "Failure",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function OperationsTimeline() {
  const failurePoints = operationsTimelineData.filter(d => d.failure > 10);
  
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Operations Timeline</CardTitle>
        <CardDescription>Success vs. Failure rates over the last hour</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={operationsTimelineData}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 2, strokeDasharray: '3 3' }}
              />
              <Legend />
              <Line type="monotone" dataKey="success" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failure" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              {failurePoints.map((point, index) => (
                  <ReferenceDot 
                      key={index} 
                      x={point.time} 
                      y={point.failure} 
                      r={5} 
                      fill="hsl(var(--chart-3))" 
                      stroke="white" 
                      strokeWidth={2} 
                  />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
