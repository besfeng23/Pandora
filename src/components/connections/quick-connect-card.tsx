
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quickConnectProviders } from "@/lib/data";
import { IntegrationLogo } from "./integration-logo";

type QuickConnectCardProps = {
    onConnect: (providerId: string) => void;
}

export function QuickConnectCard({ onConnect }: QuickConnectCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold text-lg">Quick Connect</CardTitle>
        <CardDescription>Authorize and start syncing in seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
            {quickConnectProviders.map((provider) => (
                <Button 
                    key={provider.id}
                    variant="secondary"
                    className="h-20 w-26 flex-col gap-2 rounded-xl"
                    onClick={() => onConnect(provider.id)}
                >
                    <IntegrationLogo name={provider.icon} className="h-7 w-7" />
                    <span className="text-xs">{provider.name}</span>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
