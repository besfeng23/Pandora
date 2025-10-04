
import { AiCopilotCard } from "@/components/settings/ai-copilot-card";
import { SettingsAuditLog } from "@/components/settings/settings-audit-log";
import { EnvImportCard } from "@/components/settings/env-import-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsOverviewTab() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Onboarding Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Checklist items will go here.</p>
                </CardContent>
            </Card>
            <AiCopilotCard />
            <SettingsAuditLog />
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>System KPIs</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>KPI cards will go here.</p>
                </CardContent>
            </Card>
            <EnvImportCard />
        </div>
    </div>
  );
}
