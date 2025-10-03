
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsAuditLog } from "@/lib/data";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";

export function SettingsAuditLog() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {settingsAuditLog.map((log) => (
                    <div key={log.id} className="flex items-center h-11">
                        <div className="mr-3">
                            {log.severity === 'info' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-foreground">{log.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground" title={log.timestamp}>
                            {formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true })}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
