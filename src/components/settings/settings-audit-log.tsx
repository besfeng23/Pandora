
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { AuditEvent } from "@/lib/data-types";

export function SettingsAuditLog() {
    const firestore = useFirestore();
    const auditLogsQuery = useMemoFirebase(() => query(collection(firestore, 'auditLogs'), orderBy('ts', 'desc'), limit(5)), [firestore]);
    const { data: auditLogs, isLoading } = useCollection<AuditEvent>(auditLogsQuery);

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (auditLogs || []).map((log) => (
                    <div key={log.id} className="flex items-center h-11">
                        <div className="mr-3">
                            {log.severity === 'info' ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-foreground">{log.action}</p>
                        </div>
                        <p className="text-xs text-muted-foreground" title={log.ts}>
                            {formatDistanceToNow(parseISO(log.ts), { addSuffix: true })}
                        </p>
                    </div>
                ))}
                 {(!auditLogs || auditLogs.length === 0) && !isLoading && (
                    <p className="text-sm text-muted-foreground text-center">No audit events found.</p>
                )}
            </CardContent>
        </Card>
    );
}
