
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { systemKpis } from "@/lib/data";

export function SystemKpis() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>System KPIs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {systemKpis.map((kpi) => (
                    <div key={kpi.title} className="bg-muted/50 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">{kpi.title}</p>
                        <p className="text-lg font-semibold">{kpi.value}</p>
                        <p className="text-xs text-muted-foreground">{kpi.footer}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
