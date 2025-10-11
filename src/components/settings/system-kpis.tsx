
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Connection, UserProfile } from "@/lib/data-types";
import { Loader2 } from 'lucide-react';

export function SystemKpis() {
    const firestore = useFirestore();

    const connectionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'connections')) : null, [firestore]);
    const { data: connections, isLoading: connectionsLoading } = useCollection<Connection>(connectionsQuery);

    const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
    const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

    const toolsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'tools')) : null, [firestore]);
    const { data: tools, isLoading: toolsLoading } = useCollection(toolsQuery);

    const isLoading = connectionsLoading || usersLoading || toolsLoading;

    const systemKpis = React.useMemo(() => {
        const activeConnections = connections?.filter(c => c.status === 'active').length || 0;
        const connectionIssues = (connections?.length || 0) - activeConnections;
        const secretsCount = connections?.filter(c => c.secretRef).length || 0;
        const usersCount = users?.length || 0;
        const toolsCount = tools?.length || 0;

        return [
            { title: 'Active Connections', value: activeConnections.toString(), footer: `${connectionIssues} issues` },
            { title: 'Secrets', value: secretsCount.toString(), footer: '0 near expiry' },
            { title: 'Users', value: usersCount.toString(), footer: '1 admin' },
            { title: 'Tools', value: toolsCount.toString(), footer: 'View registry' },
        ];
    }, [connections, users, tools]);

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>System KPIs</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {systemKpis.map((kpi) => (
                            <div key={kpi.title} className="bg-muted/50 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                                <p className="text-lg font-semibold">{kpi.value}</p>
                                <p className="text-xs text-muted-foreground">{kpi.footer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    