
"use client";

import { useState } from 'react';
import { BridgeConfigCard } from '@/components/settings/bridge-config-card';
import { AiCopilotCard } from '@/components/settings/ai-copilot-card';
import { IntegrationsCard } from '@/components/settings/integrations-card';
import { ConnectionsCard } from '@/components/settings/connections-card';
import { SettingsAuditLog } from '@/components/settings/settings-audit-log';
import { EnvImportCard } from '@/components/settings/env-import-card';
import { AddConnectionCard } from '@/components/settings/add-connection-card';
import { IntegrationDrawer } from '@/components/settings/integration-drawer';
import type { Integration } from '@/lib/data';

export default function SettingsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          <BridgeConfigCard />
          <IntegrationsCard onSelectIntegration={setSelectedIntegration} />
          <AddConnectionCard />
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <AiCopilotCard />
          <ConnectionsCard />
          <SettingsAuditLog />
          <EnvImportCard />
        </div>
      </div>
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
