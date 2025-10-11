
"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, HeartPulse, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { predictEquipmentFailure } from "@/lib/actions";
import type { PredictiveMaintenanceOutput } from "@/ai/flows/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function MaintenancePage() {
  const [analysis, setAnalysis] = useState<PredictiveMaintenanceOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const runAnalysis = () => {
    startTransition(async () => {
      setIsDialogOpen(true);
      // Using example data for demonstration
      const result = await predictEquipmentFailure({
        equipmentType: "Database Server",
        equipmentId: "db-prod-01",
        historicalData: JSON.stringify([
          { timestamp: "2023-10-01T10:00:00Z", cpu: 0.85, memory: 0.92, disk_io: 300 },
          { timestamp: "2023-10-01T11:00:00Z", cpu: 0.88, memory: 0.93, disk_io: 320 },
          { timestamp: "2023-10-01T12:00:00Z", cpu: 0.91, memory: 0.95, disk_io: 350 },
        ]),
        maintenanceLogs: JSON.stringify([
          { timestamp: "2023-09-15T08:00:00Z", type: "patch", notes: "Applied security patch" }
        ]),
      });
      setAnalysis(result);
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg">
         <CardHeader>
            {/* This title is now handled by the global header */}
         </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Analyze historical performance data and maintenance logs to identify patterns that may indicate an impending failure. Get proactive recommendations to prevent downtime.
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={runAnalysis} disabled={isPending} className="rounded-xl">
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Analyze DB Server Health
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Predictive Maintenance Analysis</DialogTitle>
            <DialogDescription>
              Analysis for equipment: Database Server (db-prod-01)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : analysis ? (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Failure Prediction</h3>
                   <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                     <p className="text-sm">
                        <span className="font-medium">Predicted Failure:</span> 
                        <Badge variant={analysis.failurePrediction.predictedFailure ? "destructive" : "default"} className="ml-2">{analysis.failurePrediction.predictedFailure ? "Yes" : "No"}</Badge>
                      </p>
                      <p className="text-sm"><span className="font-medium">Probability:</span> {(analysis.failurePrediction.failureProbability * 100).toFixed(1)}%</p>
                      <p className="text-sm"><span className="font-medium">Est. Time to Failure:</span> {analysis.failurePrediction.estimatedTimeToFailure}</p>
                      <p className="text-sm"><span className="font-medium">Reason:</span> {analysis.failurePrediction.failureReason}</p>
                   </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Maintenance Recommendation</h3>
                   <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <p className="text-sm">
                            <span className="font-medium">Priority:</span> 
                            <Badge variant={analysis.maintenanceRecommendation.priority === 'High' ? 'destructive' : 'secondary'} className="ml-2">{analysis.maintenanceRecommendation.priority}</Badge>
                        </p>
                        <div>
                            <p className="font-medium text-sm">Recommended Actions:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {analysis.maintenanceRecommendation.recommendedActions.map((action, i) => <li key={i}>{action}</li>)}
                            </ul>
                        </div>
                        <p className="text-sm"><span className="font-medium">Justification:</span> {analysis.maintenanceRecommendation.justification}</p>
                   </div>
                </div>
              </>
            ) : (
              <p>Could not retrieve analysis.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
