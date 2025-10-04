
"use client";

import { useState } from "react";
import { IntegrationsCard } from "@/components/settings/integrations-card";
import { IntegrationDrawer } from "@/components/settings/integration-drawer";
import type { Connection } from "@/lib/data-types";

export default function SettingsIntegrationsTab() {
    const [selectedIntegration, setSelectedIntegration] = useState<Connection | null>(null);

    return (
        <>
            <IntegrationsCard onSelectIntegration={setSelectedIntegration} />
            <IntegrationDrawer
                integration={selectedIntegration}
                open={!!selectedIntegration}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedIntegration(null);
                    }
                }}
            />
        </>
    );
}
