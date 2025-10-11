
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Image from 'next/image';

// Mock data for galaxy visualization
const incidents = [
    { id: 'inc-1', x: 50, y: 50, size: 20, priority: 'P1' },
    { id: 'inc-2', x: 200, y: 150, size: 12, priority: 'P2' },
    { id: 'inc-3', x: 350, y: 80, size: 8, priority: 'P3' },
    { id: 'inc-4', x: 100, y: 250, size: 8, priority: 'P3' },
    { id: 'inc-5', x: 280, y: 220, size: 5, priority: 'P4' },
];

const connections = [
    { from: 'inc-1', to: 'inc-2' },
    { from: 'inc-1', to: 'inc-3' },
    { from: 'inc-2', to: 'inc-5' },
];

const priorityColors = {
    P1: 'hsl(var(--destructive))',
    P2: 'hsl(var(--chart-3))',
    P3: 'hsl(var(--chart-1))',
    P4: 'hsl(var(--muted-foreground))',
}

export default function IncidentGalaxy() {
  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Globe className="text-primary" />
            Incident Galaxy
        </CardTitle>
        <CardDescription>3D visualization of incidents and their relationships.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center relative">
        <Image 
          src="https://picsum.photos/seed/galaxy/400/300"
          alt="Galaxy map placeholder"
          width={400}
          height={300}
          className="rounded-lg opacity-10 dark:opacity-20 absolute inset-0 object-cover w-full h-full"
          data-ai-hint="space galaxy"
        />
        <svg viewBox="0 0 400 300" className="w-full h-full relative z-10 overflow-visible">
            {connections.map((conn, i) => {
                const from = incidents.find(inc => inc.id === conn.from);
                const to = incidents.find(inc => inc.id === conn.to);
                if (!from || !to) return null;
                return (
                    <line 
                        key={i} 
                        x1={from.x} y1={from.y} 
                        x2={to.x} y2={to.y} 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                    />
                );
            })}
            {incidents.map(inc => (
                <g key={inc.id} transform={`translate(${inc.x}, ${inc.y})`} className="cursor-pointer group">
                    <circle cx="0" cy="0" r={inc.size} fill={priorityColors[inc.priority as keyof typeof priorityColors]} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <circle cx="0" cy="0" r={inc.size + 2} fill={priorityColors[inc.priority as keyof typeof priorityColors]} className="opacity-20 animate-pulse" />
                    <title>{`${inc.id} - ${inc.priority}`}</title>
                </g>
            ))}
        </svg>
      </CardContent>
    </Card>
  );
}
