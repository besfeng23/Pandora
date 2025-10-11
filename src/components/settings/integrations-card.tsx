
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IntegrationLogo } from "@/components/connections/integration-logo";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Connection } from "@/lib/data-types";
import { Loader2 } from "lucide-react";

const statusClasses: { [key: string]: string } = {
  active: "text-primary",
  warning: "text-yellow-600",
  error: "text-red-600",
  pending: "text-muted-foreground",
  paused: "text-muted-foreground",
};

const IntegrationTile = ({ integration, onSelect }: { integration: Connection, onSelect: () => void }) => {
    const chartData = integration.usage7d.map((value, index) => ({ name: index, value }));
    return (
        <button
            className="border border-border rounded-2xl p-4 min-h-[104px] text-left cursor-pointer hover:bg-muted anim-lift w-full"
            onClick={onSelect}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <IntegrationLogo name={integration.providerId} />
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


export function IntegrationsCard({ onSelectIntegration }: { onSelectIntegration: (integration: Connection) => void }) {
    const [filter, setFilter] = useState("All");
    
    const firestore = useFirestore();
    const connectionsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'connections') : null, [firestore]);
    const { data: integrations, isLoading } = useCollection<Connection>(connectionsQuery);

    const filteredIntegrations = (integrations || []).filter(integration => {
        if (filter === 'All') return true;
        if (filter === 'Connected') return integration.status === 'active';
        if (filter === 'Needs attention') return ['warning', 'error', 'paused'].includes(integration.status);
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
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredIntegrations.map((integration) => (
                    <IntegrationTile key={integration.id} integration={integration} onSelect={() => onSelectIntegration(integration)} />
                ))}
            </CardContent>
        </Card>
    );
}
