"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AddConnectionCard() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5 flex items-center gap-2">
                <Button variant="outline" className="rounded-xl w-full">Add connection</Button>
                <Button variant="outline" className="rounded-xl w-full">Add connection</Button>
            </CardContent>
        </Card>
    );
}
