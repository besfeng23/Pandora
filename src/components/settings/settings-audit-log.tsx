"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsAuditLog } from "@/lib/data";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function SettingsAuditLog() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {settingsAuditLog.map((log) => (
                    <div key={log.id} className="flex items-center h-11">
                        <div className="mr-3">
                            {log.severity === 'info' ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-warning" />
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-text">{log.title}</p>
                        </div>
                        <p className="text-xs text-text-muted">{log.timestamp}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
