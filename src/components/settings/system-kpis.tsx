
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Note: This data is now static. In a real app, you'd fetch this from various sources.
const systemKpis = [
    { title: 'Active Connections', value: '12', footer: '2 issues' },
    { title: 'Secrets', value: '43', footer: '5 near expiry' },
    { title: 'Users', value: '104', footer: '3 admins' },
    { title: 'Tools', value: '256', footer: 'View registry' },
];

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
