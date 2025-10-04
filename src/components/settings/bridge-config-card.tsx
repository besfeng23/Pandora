
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

function StatTile({ label, footerText, footerStatus = 'neutral' }: { label: string, footerText: string, footerStatus?: 'success' | 'neutral' }) {
    const { toast } = useToast();

    const handleTestConnection = () => {
        toast({
            title: "Bridge healthy",
            description: "RTT 121 ms.",
        });
    }
    
    return (
        <div className="bg-muted/50 rounded-xl p-4 flex flex-col justify-between w-[160px] h-[72px]">
            <p className="text-sm text-muted-foreground">{label}</p>
            <button 
                onClick={footerText === 'Test connection' ? handleTestConnection : undefined}
                className={`text-sm font-medium text-left ${footerStatus === 'success' ? 'text-green-600' : 'text-muted-foreground'} hover:underline`}
            >
                {footerText}
            </button>
        </div>
    )
}

export function BridgeConfigCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>Bridge Configuration</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem>View logs</DropdownMenuItem>
            <DropdownMenuItem>Rotate token</DropdownMenuItem>
            <DropdownMenuItem>Copy URL</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex gap-4">
        <StatTile label="URL configured" footerText="Test connection" footerStatus="success" />
        <StatTile label="Token present" footerText="Last test 2m" />
      </CardContent>
    </Card>
  );
}
