
"use client";

import { useState, useTransition } from "react";
import { Bell, BrainCircuit, Loader2 } from "lucide-react";
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
import { predictiveAlert } from "@/lib/actions";
import type { PredictiveAlertOutput } from "@/ai/flows/predictive-alerting";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function PredictiveAlertCard() {
  const [prediction, setPrediction] = useState<PredictiveAlertOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPrediction = () => {
    setPrediction(null);
    startTransition(async () => {
      setIsDialogOpen(true);
      const result = await predictiveAlert({
        metricName: "CPU Utilization",
        currentValue: 85,
        trendData: [60, 65, 70, 72, 75, 78, 81, 85],
        threshold: 90,
        timeWindow: "last 2 hours",
      });
      setPrediction(result);
    });
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Bell />
            </div>
            <div>
                <CardTitle className="font-headline">Predictive Alerting</CardTitle>
                <CardDescription>Forecast when alerts might fire based on trends.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Use AI to analyze metric trends and predict future alerts. This helps in proactively addressing issues before they impact users.
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchPrediction} disabled={isPending}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Run Prediction
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predictive Alert Result</DialogTitle>
            <DialogDescription>
              AI analysis for metric: CPU Utilization
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : prediction ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Predicted Firing Time</h3>
                  <p className="text-sm text-primary">
                    {prediction.predictedFiringTime
                      ? formatDistanceToNow(new Date(prediction.predictedFiringTime), { addSuffix: true })
                      : "Not predicted to fire"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Confidence Level</h3>
                  <p className="text-sm">{(prediction.confidenceLevel * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <h3 className="font-semibold">Explanation</h3>
                  <p className="text-sm text-muted-foreground">{prediction.explanation}</p>
                </div>
                 <div>
                  <h3 className="font-semibold">Suggested Threshold</h3>
                  <p className="text-sm">{prediction.suggestedThresholdAdjustment} %</p>
                </div>
              </div>
            ) : (
              <p>Could not retrieve prediction.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
