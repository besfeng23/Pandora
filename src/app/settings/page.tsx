
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsOverviewTab from "@/components/settings/tabs/overview";
import SettingsBridgeTab from "@/components/settings/tabs/bridge";
import SettingsIntegrationsTab from "@/components/settings/tabs/integrations";
import SettingsSecretsTab from "@/components/settings/tabs/secrets";
import SettingsConnectionsTab from "@/components/settings/tabs/connections";
import SettingsAccessTab from "@/components/settings/tabs/access";

export default function SettingsPage() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bridge">Bridge</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="secrets">Secrets</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <SettingsOverviewTab />
      </TabsContent>
      <TabsContent value="bridge">
        <SettingsBridgeTab />
      </TabsContent>
      <TabsContent value="integrations">
        <SettingsIntegrationsTab />
      </TabsContent>
      <TabsContent value="secrets">
        <SettingsSecretsTab />
      </TabsContent>
      <TabsContent value="connections">
        <SettingsConnectionsTab />
      </TabsContent>
      <TabsContent value="access">
        <SettingsAccessTab />
      </TabsContent>
    </Tabs>
  );
}
