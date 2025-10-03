"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EnvImportCard() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">.env import</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                <Button variant="secondary" className="rounded-xl w-full">Parse</Button>
                <Button className="rounded-xl w-full">Save All</Button>
            </CardContent>
        </Card>
    );
}
