
"use client";

import { useState } from "react";
import { ConnectionDetailsDrawer } from "@/components/connections/connection-details-drawer";
import { QuickConnectCard } from "@/components/connections/quick-connect-card";
import { ServicesGrid } from "@/components/connections/services-grid";
import { connectionData, type Connection } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Image from 'next/image';
import AuditLogTable from "@/components/audit/audit-log-table";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(connectionData);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
  };

  const handleConnect = (providerId: string) => {
    // Placeholder for OAuth flow
    console.log(`Initiating connection for ${providerId}`);
    const connection = connections.find(c => c.providerId === providerId);
    if (connection) {
      const updatedConnections = connections.map(c => 
        c.providerId === providerId ? { ...c, status: 'active' as const } : c
      );
      setConnections(updatedConnections);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <h1 className="text-3xl font-semibold tracking-tight">Connections</h1>
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-6">
            <QuickConnectCard onConnect={handleConnect} />
            <ServicesGrid connections={connections} onSelectConnection={handleSelectConnection} />
             <Card className="col-span-1 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl font-semibold">Audit Log</CardTitle>
                    <CardDescription>An immutable log of all connection events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center p-8">Audit log coming soon.</p>
                </CardContent>
            </Card>
        </div>
        <div className="col-span-12 lg:col-span-4">
             <Card className="rounded-2xl shadow-lg h-[288px] flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Globe className="text-primary" />
                        Connection Graph
                    </CardTitle>
                    <CardDescription>3D visualization of connections.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                    <div className="text-center text-muted-foreground relative">
                    <Image 
                        src="https://picsum.photos/seed/connect-galaxy/300/150"
                        alt="Galaxy map placeholder"
                        width={300}
                        height={150}
                        className="rounded-lg opacity-20"
                        data-ai-hint="space galaxy"
                    />
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium">3D map coming soon</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <ConnectionDetailsDrawer
        connection={selectedConnection}
        open={!!selectedConnection}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedConnection(null);
          }
        }}
      />
    </>
  );
}
