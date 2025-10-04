
"use client";

import { useState } from "react";
import { ConnectionDetailsDrawer } from "@/components/connections/connection-details-drawer";
import { QuickConnectCard } from "@/components/connections/quick-connect-card";
import { ServicesGrid } from "@/components/connections/services-grid";
import { connectionData, type Connection } from "@/lib/data";

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

        <div className="col-span-12 lg:col-span-8">
            <div className="space-y-6">
                <QuickConnectCard onConnect={handleConnect} />
                <ServicesGrid connections={connections} onSelectConnection={handleSelectConnection} />
            </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
            {/* Placeholder for Connection Graph, Audit Log, etc. */}
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
