
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Connection } from "@/app/connections/page";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IntegrationLogo } from "./integration-logo";

type ConnectionCardProps = {
  connection: Connection;
  onSelect: () => void;
};

const statusClasses = {
  active: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  error: "bg-destructive text-destructive-foreground",
  pending: "bg-muted text-muted-foreground",
  paused: "bg-muted text-muted-foreground",
};

export function ConnectionCard({ connection, onSelect }: ConnectionCardProps) {
  const chartData = connection.usage7d.map((value, index) => ({ name: index, value }));
  const isConnected = connection.status === 'active' || connection.status === 'warning' || connection.status === 'error';

  return (
    <Card className="shadow-sm anim-lift flex flex-col p-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IntegrationLogo name={connection.providerId} className="h-6 w-6" />
          <span className="font-semibold">{connection.name}</span>
        </div>
        <Badge className={cn("capitalize text-xs rounded-md", statusClasses[connection.status])}>
          {connection.status}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Last sync</div>
          <div className="font-medium">
            {connection.health.lastSyncISO ? formatDistanceToNow(new Date(connection.health.lastSyncISO), { addSuffix: true }) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">API Usage</div>
          <div className="font-medium">{connection.health.quotaUsedPct}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Scopes</div>
          <div className="font-medium">{connection.scopes.length}</div>
        </div>
      </div>

      <div className="mt-4 h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center gap-2">
        <Button onClick={onSelect} className="flex-grow rounded-lg">
          {isConnected ? 'Manage' : 'Connect'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem>Rotate key</DropdownMenuItem>
            <DropdownMenuItem>Pause</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
            <DropdownMenuItem>View logs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
