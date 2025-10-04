
"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, DollarSign, Loader2, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cloudWastageDetection } from "@/lib/actions";
import type { CloudWastageDetectionOutput } from "@/ai/flows/cloud-wastage-detection";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CostOptimizationPage() {
  const [analysis, setAnalysis] = useState<CloudWastageDetectionOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAnalysis = () => {
    setAnalysis(null);
    startTransition(async () => {
      // Using example data for demonstration
      const result = await cloudWastageDetection({
        cloudProvider: "GCP",
        accountId: "gcp-prod-12345",
        region: "us-central1",
        resourceTypes: ["Compute Engine", "Cloud Storage"],
      });
      setAnalysis(result);
    });
  };
  
  const totalSavings = analysis?.idleResources.reduce((acc, res) => acc + res.estimatedWastedCost, 0) || 0;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <DollarSign />
            </div>
            <div>
              <CardTitle className="font-headline">Cloud Cost Optimization</CardTitle>
              <CardDescription>Use AI to detect cloud wastage and get optimization recommendations.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="space-y-2">
                <Label htmlFor="provider">Cloud Provider</Label>
                <Input id="provider" defaultValue="GCP" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="account">Account ID</Label>
                <Input id="account" defaultValue="gcp-prod-12345" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" defaultValue="us-central1" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="resources">Resource Types</Label>
                <Input id="resources" defaultValue="Compute Engine" className="rounded-xl" />
             </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runAnalysis} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Detect Wastage
          </Button>
        </CardFooter>
      </Card>
      
      {isPending && (
         <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing cloud resources...</p>
         </div>
      )}

      {analysis && (
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Optimization Report</CardTitle>
            <CardDescription>
                Found <span className="font-bold text-primary">${totalSavings.toFixed(2)}</span> in potential monthly savings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.idleResources.length > 0 ? (
                analysis.idleResources.map((res, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-muted/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{res.resourceId} <Badge variant="secondary">{res.resourceType}</Badge></h3>
                                <p className="text-sm text-primary font-medium mt-1">{res.recommendation}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">${res.estimatedWastedCost.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Est. Savings</p>
                            </div>
                        </div>
                        <div className="mt-3">
                           <h4 className="text-xs font-semibold text-muted-foreground">Evidence</h4>
                            <ul className="text-xs list-disc pl-5 mt-1">
                                {res.evidence.map((ev, j) => <li key={j} className="font-mono">{ev}</li>)}
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <BarChart className="mx-auto h-10 w-10" />
                    <p className="mt-2">No idle resources found. Well done!</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
