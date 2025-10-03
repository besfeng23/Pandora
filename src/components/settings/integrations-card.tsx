
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { integrations, type Integration } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Github, FileJson, Cloud, Bot, Blocks, Database, FileText, Component } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const IntegrationLogo = ({ name }: { name: string }) => {
    const logos: { [key: string]: React.ElementType } = {
        GitHub: Github,
        OpenAI: Bot,
        Gcp: Cloud,
        Linear: Blocks,
        Firebase: Component,
        Neon: Database,
        Notion: FileText,
    };
    const LogoComponent = logos[name];
    if (!LogoComponent) return <FileJson className="h-8 w-8" />;
    return <LogoComponent className="h-8 w-8" />;
};

const statusClasses: { [key: string]: string } = {
  healthy: "text-green-600",
  active: "text-green-600",
  degraded: "text-yellow-600",
  disconnected: "text-red-600",
  needs_attention: "text-yellow-600",
};

const IntegrationTile = ({ integration, onSelect }: { integration: Integration, onSelect: () => void }) => {
    const chartData = integration.sparkline.map((value, index) => ({ name: index, value }));
    return (
        <button
            className="border border-border rounded-2xl p-4 min-h-[104px] text-left cursor-pointer hover:bg-muted anim-lift w-full"
            onClick={onSelect}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <IntegrationLogo name={integration.name} />
                    <div>
                        <p className="font-semibold">{integration.name}</p>
                        <p className={cn("text-xs font-medium capitalize", statusClasses[integration.status] || 'text-muted-foreground')}>
                            {integration.status}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-2 h-6 w-[92px] ml-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </button>
    );
};


export function IntegrationsCard({ onSelectIntegration }: { onSelectIntegration: (integration: Integration) => void }) {
    const [filter, setFilter] = useState("All");

    const filteredIntegrations = integrations.filter(integration => {
        if (filter === 'All') return true;
        if (filter === 'Connected') return integration.status === 'healthy' || integration.status === 'active';
        if (filter === 'Needs attention') return integration.status === 'degraded' || integration.status === 'disconnected' || integration.status === 'needs_attention';
        return false;
    })

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div>
                        <CardTitle>Integrations</CardTitle>
                        <CardDescription>Manage your third-party service integrations.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {["All", "Connected", "Needs attention"].map((item) => (
                            <Button 
                                key={item} 
                                variant={filter === item ? "secondary" : "ghost"} 
                                size="sm" 
                                onClick={() => setFilter(item)}
                                className="rounded-lg h-7 px-3 text-xs"
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                    <IntegrationTile key={integration.id} integration={integration} onSelect={() => onSelectIntegration(integration)} />
                ))}
            </CardContent>
        </Card>
    );
}
