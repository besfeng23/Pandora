
"use client";

import HealthOverview from "@/components/dashboard/health-overview";
import OperationsTimeline from "@/components/dashboard/operations-timeline";
import AiCopilot from "@/components/dashboard/ai-copilot";
import ServicesOverview from "@/components/dashboard/services-overview";
import IncidentGalaxy from "@/components/dashboard/incident-galaxy";
import PredictiveAlertCard from "@/components/dashboard/predictive-alert-card";
import RootCauseAnalysisCard from "@/components/dashboard/root-cause-analysis-card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <HealthOverview />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <OperationsTimeline />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <AiCopilot />
      </div>
      
      <div className="col-span-12 md:col-span-6">
        <PredictiveAlertCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <RootCauseAnalysisCard />
      </div>
      
      <div className="col-span-12 xl:col-span-8">
        <ServicesOverview />
      </div>
      
      <div className="col-span-12 xl:col-span-4">
        <IncidentGalaxy />
      </div>
    </div>
  );
}
