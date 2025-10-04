
"use client";

import { ConnectionCard } from "./connection-card";
import type { Connection } from "@/app/connections/page";

type ServicesGridProps = {
    connections: Connection[];
    onSelectConnection: (connection: Connection) => void;
}

export function ServicesGrid({ connections, onSelectConnection }: ServicesGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map(conn => (
                <ConnectionCard key={conn.id} connection={conn} onSelect={() => onSelectConnection(conn)} />
            ))}
        </div>
    )
}
