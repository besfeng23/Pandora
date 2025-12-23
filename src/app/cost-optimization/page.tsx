
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
import type { CloudWastageDetectionOutput } from "@/ai/flows/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { getCurrentUserToken } from "@/lib/firebase/client";
import { useToast } from "@/components/ui/use-toast";

export default function CostOptimizationPage() {
  const [analysis, setAnalysis] = useState<CloudWastageDetectionOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  const { toast } = useToast();

  const runAnalysis = () => {
    setAnalysis(null);
    startTransition(async () => {
      try {
        const token = await getCurrentUserToken(auth);
        const response = await fetch("/api/ai/cloud-optimization", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cloudProvider: "vercel",
            accountId: "vercel-prod",
            region: "iad1",
            resourceTypes: ["functions", "edge", "firestore"],
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const result = (await response.json()) as CloudWastageDetectionOutput;
        setAnalysis(result);
      } catch (error) {
        console.error(error);
        toast({
          title: "Could not run analysis",
          description: "Authentication is required to analyze resources.",
          variant: "destructive",
        });
      }
    });
  };
  
  const totalSavings = analysis?.idleResources.reduce((acc, res) => acc + res.estimatedWastedCost, 0) || 0;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          {/* This title is now handled by the global header */}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="space-y-2">
                <Label htmlFor="provider">Cloud Provider</Label>
                <Input id="provider" defaultValue="Vercel" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="account">Account ID</Label>
                <Input id="account" defaultValue="vercel-prod" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" defaultValue="iad1" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="resources">Resource Types</Label>
                <Input id="resources" defaultValue="Functions, Edge" className="rounded-xl" />
             </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runAnalysis} disabled={isPending} className="rounded-xl">
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
