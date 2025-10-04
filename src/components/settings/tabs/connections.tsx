
import { AddConnectionCard } from "@/components/settings/add-connection-card";
import { ConnectionsCard } from "@/components/settings/connections-card";

export default function SettingsConnectionsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddConnectionCard />
        <ConnectionsCard />
    </div>
  );
}
