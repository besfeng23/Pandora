
"use client";

import React, { useState } from "react";
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
import { FileWarning, PlusCircle, Filter, Loader2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import type { Incident } from "@/lib/data-types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const statusConfig: Record<Incident['status'], { label: string; className: string }> = {
  investigating: { label: "Investigating", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  identified: { label: "Identified", className: "bg-blue-100 text-blue-800 border-blue-200" },
  monitoring: { label: "Monitoring", className: "bg-green-100 text-green-800 border-green-200" },
  resolved: { label: "Resolved", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const priorityConfig: Record<Incident['priority'], { label: string; className: string }> = {
  P1: { label: "P1", className: "bg-red-100 text-red-800 border-red-200" },
  P2: { label: "P2", className: "bg-orange-100 text-orange-800 border-orange-200" },
  P3: { label: "P3", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  P4: { label: "P4", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export default function IncidentsPage() {
  const [filter, setFilter] = useState<Incident['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<"time" | "priority" | "status">("time");
  const firestore = useFirestore();

  const incidentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const constraints = [];
    if (filter !== 'all') {
        constraints.push(where('status', '==', filter));
    }
    constraints.push(orderBy(sortBy, 'desc'));
    return query(collection(firestore, 'incidents'), ...constraints);
  }, [firestore, filter, sortBy]);

  const { data: incidents, isLoading } = useCollection<Incident>(incidentsQuery);

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
                    <DropdownMenuItem onClick={() => setFilter('all')}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('investigating')}>Investigating</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('identified')}>Identified</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('monitoring')}>Monitoring</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('resolved')}>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl">
                  <ChevronsUpDown className="mr-2 h-4 w-4" />
                  Sort by: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setSortBy("time")}>Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NewIncidentDialog />
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                ) : (incidents || []).length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No incidents found for this filter.
                        </TableCell>
                    </TableRow>
                ) : (incidents || []).map((incident) => (
                <TableRow key={incident.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-xs text-muted-foreground font-mono">{incident.id}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("capitalize rounded-md", statusConfig[incident.status]?.className)}>
                            {statusConfig[incident.status]?.label || incident.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("capitalize rounded-md", priorityConfig[incident.priority]?.className)}>
                            {priorityConfig[incident.priority]?.label || incident.priority}
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

function NewIncidentDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-xl"><PlusCircle className="mr-2"/> New Incident</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
                <DialogDescription>
                Declare a new incident to begin investigation.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" placeholder="e.g. API Gateway 5xx errors" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">Priority</Label>
                    <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="P1">P1 (Critical)</SelectItem>
                            <SelectItem value="P2">P2 (High)</SelectItem>
                            <SelectItem value="P3">P3 (Medium)</SelectItem>
                            <SelectItem value="P4">P4 (Low)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Declare Incident</Button>
            </DialogFooter>
            </DialogContent>
      </Dialog>
    )
}

    