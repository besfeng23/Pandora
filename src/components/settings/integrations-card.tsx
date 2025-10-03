"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { integrations, type Integration } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Github, FileJson, AlertTriangle, Cloud, Bot, Blocks, Database, FileText } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const IntegrationLogo = ({ name }: { name: string }) => {
    const logos: { [key: string]: React.ElementType } = {
        Github,
        Openai: Bot,
        Gcp: Cloud,
        Linear: Blocks,
        Firebase,
        Neon: Database,
        Notion: FileText,
    };
    const LogoComponent = logos[name];
    if (!LogoComponent) return <FileJson />;
    return <LogoComponent className="h-8 w-8 text-text" />;
};

const statusClasses = {
  healthy: "text-success",
  active: "text-success",
  degraded: "text-warning",
  losing: "text-warning",
  disconnected: "text-danger",
};

const IntegrationTile = ({ integration }: { integration: Integration }) => {
    const chartData = integration.sparkline.map((value, index) => ({ name: index, value }));
    return (
        <div className="border border-border rounded-xl p-4 min-h-[104px] cursor-pointer hover:bg-surface-muted transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <IntegrationLogo name={integration.name} />
                    <div>
                        <p className="text-sm font-semibold">{integration.name}</p>
                        <p className={cn("text-xs font-medium capitalize", statusClasses[integration.status])}>
                            {integration.status}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-2 h-6 w-[92px] ml-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--graph))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export function IntegrationsCard() {
    const [filter, setFilter] = useState("All");

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
                <CardTitle className="text-base font-semibold">Integrations</CardTitle>
                <div className="flex items-center gap-2">
                    {["All", "Connected", "Needs attention"].map((item) => (
                        <Button 
                            key={item} 
                            variant={filter === item ? "secondary" : "ghost"} 
                            size="sm" 
                            onClick={() => setFilter(item)}
                            className="rounded-xl h-7 px-3 text-xs"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                    <IntegrationTile key={integration.id} integration={integration} />
                ))}
            </CardContent>
        </Card>
    );
}
