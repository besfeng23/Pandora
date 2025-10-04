
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
import { MoreHorizontal } from "lucide-react";

const existingConnections = [
    { id: 'c1', source: 'Auth Service', target: 'User DB', type: 'API', latency: '45ms', status: 'Healthy' },
    { id: 'c2', source: 'Billing API', target: 'Stripe', type: 'Webhook', latency: '120ms', status: 'Healthy' },
    { id: 'c3', source: 'Content Processor', target: 'Cloud Storage', type: 'API', latency: '250ms', status: 'Degraded' },
];

export default function SettingsConnectionsTab() {
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
                            <TableHead>Source</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>P95 Latency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {existingConnections.map(conn => (
                            <TableRow key={conn.id}>
                                <TableCell className="font-medium">{conn.source}</TableCell>
                                <TableCell className="font-medium">{conn.target}</TableCell>
                                <TableCell><Badge variant="outline" className="rounded-md">{conn.type}</Badge></TableCell>
                                <TableCell>{conn.latency}</TableCell>
                                <TableCell>
                                     <Badge variant={conn.status === 'Healthy' ? 'default' : 'destructive'} className={`capitalize rounded-md ${conn.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
