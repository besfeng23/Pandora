
"use client";

import React from 'react';
import { Line, LineChart, ReferenceDot, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { AuditEvent } from '@/lib/data-types';
import { subHours, format, eachMinuteOfInterval } from 'date-fns';

const chartConfig = {
  success: { label: "Success", color: "hsl(var(--chart-1))" },
  failure: { label: "Failure", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export default function OperationsTimeline() {
  const firestore = useFirestore();
  
  const auditLogQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const oneHourAgo = subHours(new Date(), 1);
    return query(
      collection(firestore, 'auditLogs'), 
      where('ts', '>=', oneHourAgo.toISOString()),
      orderBy('ts', 'asc')
    );
  }, [firestore]);

  const { data: auditLogs, isLoading } = useCollection<AuditEvent>(auditLogQuery);

  const operationsTimelineData = React.useMemo(() => {
    const now = new Date();
    const oneHourAgo = subHours(now, 1);
    const interval = { start: oneHourAgo, end: now };

    const minutes = eachMinuteOfInterval(interval, { step: 5 });

    const data = minutes.map(minute => {
      return {
        time: format(minute, 'HH:mm'),
        success: 0,
        failure: 0,
      };
    });

    if (auditLogs) {
      auditLogs.forEach(log => {
        const logTime = new Date(log.ts);
        const minuteIndex = Math.floor((logTime.getTime() - oneHourAgo.getTime()) / (1000 * 60 * 5));
        if (minuteIndex >= 0 && minuteIndex < data.length) {
          if (log.result === 'success') {
            data[minuteIndex].success++;
          } else {
            data[minuteIndex].failure++;
          }
        }
      });
    }

    return data;
  }, [auditLogs]);

  const failurePoints = operationsTimelineData.filter(d => d.failure > 0);
  
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
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 2, strokeDasharray: '3 3' }} />
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
