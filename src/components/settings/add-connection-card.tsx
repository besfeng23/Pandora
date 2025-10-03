
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddConnectionDialog } from "./add-connection-dialog";

export function AddConnectionCard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                    <Button variant="outline" className="rounded-xl w-full" onClick={() => setIsDialogOpen(true)}>Add connection</Button>
                </CardContent>
            </Card>
            <AddConnectionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
