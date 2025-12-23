
"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Search, Loader2 } from "lucide-react";
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
import type { RootCauseAnalysisOutput } from "@/ai/flows/types";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/firebase";
import { getCurrentUserToken } from "@/lib/firebase/client";
import { useToast } from "@/components/ui/use-toast";

export default function RootCauseAnalysisCard() {
  const [analysis, setAnalysis] = useState<RootCauseAnalysisOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const runAnalysis = () => {
    setAnalysis(null);
    startTransition(async () => {
      setIsDialogOpen(true);
      try {
        const token = await getCurrentUserToken(auth);
        const response = await fetch("/api/ai/root-cause", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            incidentDescription: "High latency and 5xx errors on 'User Profiles' service starting at 10:15 AM. Database CPU is at 95%. Logs show 'connection timeout' errors.",
          }),
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const result = (await response.json()) as RootCauseAnalysisOutput;
        setAnalysis(result);
      } catch (error) {
        console.error(error);
        toast({
          title: "Analysis failed",
          description: "Authentication is required to run root cause analysis.",
          variant: "destructive",
        });
        setAnalysis(null);
      }
    });
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg">
         <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Search />
                </div>
                <div>
                    <CardTitle className="font-headline">Root Cause Analysis</CardTitle>
                    <CardDescription>AI-driven analysis to find the source of incidents.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                For a given incident, the AI will analyze logs and metrics to identify the most likely root cause, helping you resolve issues faster.
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={runAnalysis} disabled={isPending}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Analyze Last Incident
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Root Cause Analysis Result</DialogTitle>
            <DialogDescription>
              Analysis for high latency on 'User Profiles' service.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Potential Root Cause</h3>
                  <p className="text-sm text-primary">{analysis.potentialRootCause}</p>
                </div>
                {analysis.supportingEvidence && (
                    <div>
                        <h3 className="font-semibold">Supporting Evidence</h3>
                        <p className="text-sm text-muted-foreground">{analysis.supportingEvidence}</p>
                    </div>
                )}
              </div>
            ) : (
              <p>Could not retrieve analysis.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
