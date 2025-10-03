import BridgeConfig from "@/components/settings/bridge-config";
import EnvImport from "@/components/settings/env-import";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your Pandora workspace and integrations.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <BridgeConfig />
        <EnvImport />
      </div>
    </div>
  );
}
