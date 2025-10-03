
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { copilotSuggestions } from "@/lib/data";
import { CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";

const statusIcons = {
    info: <CheckCircle2 className="h-5 w-5 text-success" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
};

export function AiCopilotCard() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">AI Copilot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {copilotSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center p-2 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer group">
                        <div className="mr-3">
                            {statusIcons[suggestion.status]}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-text">{suggestion.title}</p>
                            <p className="text-xs text-text-muted">{suggestion.subtext}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {suggestion.cta}
                        </Button>
                        <ChevronRight className="h-5 w-5 text-text-subtle ml-1" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
