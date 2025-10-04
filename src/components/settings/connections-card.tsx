
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Cog, Loader2 } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Connection } from "@/lib/data-types";
import { useMemo } from "react";

export function ConnectionsCard() {
    const firestore = useFirestore();
    const { data: connections, isLoading } = useCollection<Connection>(collection(firestore, 'connections'));

    const connectionSummary = useMemo(() => {
        if (!connections) {
            return { active: 0, issues: 0 };
        }
        const active = connections.filter(c => c.status === 'active').length;
        const issues = connections.length - active;
        return { active, issues };
    }, [connections]);

    const statuses = [
        { label: `${connectionSummary.active} Active`, status: 'ok' },
        { label: `${connectionSummary.issues} with issues`, status: 'fail' },
    ];

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Connections</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Cog className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    statuses.map((item) => (
                        <div key={item.label} className="flex items-center h-9">
                            {item.status === 'ok' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3"/>
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-500 mr-3"/>
                            )}
                            <p className="text-sm text-foreground">{item.label}</p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
