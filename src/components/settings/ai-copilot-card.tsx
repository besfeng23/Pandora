
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useMemo } from "react";

const statusIcons = {
    info: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
};

type CopilotSuggestion = {
    id: string;
    title: string;
    subtext: string;
    cta: string;
    status: 'info' | 'warning';
};

export function AiCopilotCard() {
    const firestore = useFirestore();
    const { data: auditLog, isLoading: auditLoading } = useCollection(useMemoFirebase(() => collection(firestore, 'auditLogs'), [firestore]));

    const suggestions = useMemo(() => {
        const suggs: CopilotSuggestion[] = [];
        if (auditLog) {
            const failedLogins = auditLog.filter(log => log.action.includes('fail'));
            if(failedLogins.length > 0) {
                suggs.push({
                    id: 'sugg1',
                    title: `${failedLogins.length} failed login attempts`,
                    subtext: 'Review security logs',
                    cta: 'View',
                    status: 'warning'
                });
            }
        }
        suggs.push({
             id: 'sugg2',
             title: 'Onboarding progress',
             subtext: '3/5 steps complete',
             cta: 'Continue',
             status: 'info'
        });
        return suggs;
    }, [auditLog]);

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">AI Copilot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {auditLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                        <div className="mr-3">
                            {statusIcons[suggestion.status]}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.subtext}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {suggestion.cta}
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-1" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
