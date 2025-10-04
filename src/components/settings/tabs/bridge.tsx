
import { BridgeConfigCard } from "@/components/settings/bridge-config-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsBridgeTab() {
  return (
    <div className="space-y-6">
      <BridgeConfigCard />
      <Card>
        <CardHeader>
          <CardTitle>Health & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Sparkline and health checks will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
