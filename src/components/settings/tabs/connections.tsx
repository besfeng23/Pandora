
"use client";

import { AddConnectionCard } from "@/components/settings/add-connection-card";
import { ConnectionsCard } from "@/components/settings/connections-card";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Connection } from "@/lib/data-types";


export default function SettingsConnectionsTab() {
  const firestore = useFirestore();
  const connectionsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'connections') : null, [firestore]);
  const { data: existingConnections, isLoading } = useCollection<Connection>(connectionsQuery);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddConnectionCard />
            <ConnectionsCard />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Existing Connections</CardTitle>
                <CardDescription>Review and manage your service-to-service connections.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Environment</TableHead>
                            <TableHead>P95 Latency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : (existingConnections || []).map(conn => (
                            <TableRow key={conn.id}>
                                <TableCell className="font-medium">{conn.name}</TableCell>
                                <TableCell className="font-medium">{conn.providerId}</TableCell>
                                <TableCell><Badge variant="outline" className="rounded-md capitalize">{conn.env}</Badge></TableCell>
                                <TableCell>{conn.health.latencyP95}ms</TableCell>
                                <TableCell>
                                     <Badge variant={conn.status === 'active' ? 'default' : 'destructive'} className={`capitalize rounded-md ${conn.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {conn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
