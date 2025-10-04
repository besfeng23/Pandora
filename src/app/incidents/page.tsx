
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileWarning, PlusCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";
type IncidentPriority = "P1" | "P2" | "P3" | "P4";

const incidents = [
  { id: "INC-1204", title: "High latency on User Profiles service", status: "investigating" as IncidentStatus, priority: "P1" as IncidentPriority, services: ["User Profiles"], time: "2h ago" },
  { id: "INC-1203", title: "Realtime Analytics DB is down", status: "identified" as IncidentStatus, priority: "P1" as IncidentPriority, services: ["Realtime Analytics"], time: "5h ago" },
  { id: "INC-1202", title: "Billing API returning intermittent 500s", status: "monitoring" as IncidentStatus, priority: "P2" as IncidentPriority, services: ["Billing API"], time: "1d ago" },
  { id: "INC-1201", title: "Failed deployment to staging", status: "resolved" as IncidentStatus, priority: "P3" as IncidentPriority, services: ["CI/CD Pipeline"], time: "2d ago" },
];

const statusConfig: Record<IncidentStatus, { label: string; className: string }> = {
  investigating: { label: "Investigating", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  identified: { label: "Identified", className: "bg-blue-100 text-blue-800 border-blue-200" },
  monitoring: { label: "Monitoring", className: "bg-green-100 text-green-800 border-green-200" },
  resolved: { label: "Resolved", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const priorityConfig: Record<IncidentPriority, { label: string; className: string }> = {
  P1: { label: "P1", className: "bg-red-100 text-red-800 border-red-200" },
  P2: { label: "P2", className: "bg-orange-100 text-orange-800 border-orange-200" },
  P3: { label: "P3", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  P4: { label: "P4", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export default function IncidentsPage() {
  const [filter, setFilter] = useState<IncidentStatus | 'all'>('all');

  const filteredIncidents = incidents.filter(inc => filter === 'all' || inc.status === filter);

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary"><FileWarning /></div>
                <div>
                    <CardTitle className="font-headline">Incidents</CardTitle>
                    <CardDescription>Track and manage active and past incidents.</CardDescription>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl"><Filter className="mr-2"/> Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('investigating')}>Investigating</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('identified')}>Identified</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('monitoring')}>Monitoring</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('resolved')}>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button className="rounded-xl"><PlusCircle className="mr-2"/> New Incident</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-xl overflow-hidden">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Affected Services</TableHead>
                <TableHead>Last Update</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredIncidents.map((incident) => (
                <TableRow key={incident.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-xs text-muted-foreground font-mono">{incident.id}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("capitalize rounded-md", statusConfig[incident.status].className)}>
                            {statusConfig[incident.status].label}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("capitalize rounded-md", priorityConfig[incident.priority].className)}>
                            {priorityConfig[incident.priority].label}
                        </Badge>
                    </TableCell>
                     <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {incident.services.map(s => <Badge key={s} variant="secondary" className="rounded-md">{s}</Badge>)}
                        </div>
                     </TableCell>
                     <TableCell className="text-muted-foreground text-xs">{incident.time}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
