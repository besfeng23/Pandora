"use client";

import { Line, LineChart, ReferenceDot, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const operationsTimelineData = [
  { time: 'T-60', success: 186, failure: 2 },
  { time: 'T-55', success: 220, failure: 3 },
  { time: 'T-50', success: 200, failure: 1 },
  { time: 'T-45', success: 190, failure: 4 },
  { time: 'T-40', success: 210, failure: 2 },
  { time: 'T-35', success: 250, failure: 15 }, // failure point
  { time: 'T-30', success: 230, failure: 1 },
  { time: 'T-25', success: 240, failure: 3 },
  { time: 'T-20', success: 220, failure: 0 },
  { time: 'T-15', success: 260, failure: 1 },
  { time: 'T-10', success: 270, failure: 12 }, // failure point
  { time: 'T-5', success: 280, failure: 2 },
  { time: 'Now', success: 304, failure: 1 },
];


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
              <Line type="monotone" dataKey="success" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ className: 'tl-dot tl-ok' }} />
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
                      className="tl-dot tl-fail"
                  />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
