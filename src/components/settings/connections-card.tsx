"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { connectionStatuses } from "@/lib/data";
import { CheckCircle2, AlertCircle, Cog } from "lucide-react";

export function ConnectionsCard() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Connections</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Cog className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {connectionStatuses.map((item) => (
                    <div key={item.label} className="flex items-center h-9">
                        {item.status === 'ok' ? (
                            <CheckCircle2 className="h-5 w-5 text-success mr-3"/>
                        ) : (
                            <AlertCircle className="h-5 w-5 text-danger mr-3"/>
                        )}
                        <p className="text-sm text-text">{item.label}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
