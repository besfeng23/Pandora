

"use client";

import { AiCopilotCard } from "@/components/settings/ai-copilot-card";
import { SettingsAuditLog } from "@/components/settings/settings-audit-log";
import { EnvImportCard } from "@/components/settings/env-import-card";
import { OnboardingChecklist } from "@/components/settings/onboarding-checklist";
import { SystemKpis } from "@/components/settings/system-kpis";

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
            <OnboardingChecklist />
            <AiCopilotCard />
            <SettingsAuditLog />
        </div>
        <div className="space-y-6">
            <SystemKpis />
            <EnvImportCard />
        </div>
    </div>
  );
}
