"use client";

import { useState, useTransition } from "react";
import { Wand2, RefreshCw, Check, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecommendations } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Recommendation = {
  recommendation: string;
  reason: string;
};

export default function AiCopilot() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchRecommendations = () => {
    startTransition(async () => {
      const result = await getRecommendations({
        userNeeds: "Improve system stability and reduce latency.",
        userPreferences: "Prefer non-disruptive actions, prioritize cost-saving.",
        systemState: "Auth Service healthy, Billing API healthy, User Profiles degraded, Content Processor healthy, Realtime Analytics down."
      });
      if (result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        setReasoning(result.reasoning);
      } else {
        toast({
          title: "AI Copilot",
          description: result.reasoning || "No new recommendations found.",
        });
      }
    });
  };

  const handleApply = (recommendation: string) => {
    toast({
        title: "Action Applied",
        description: `Successfully applied: "${recommendation}"`,
        action: <Check className="h-5 w-5 text-green-500" />,
    })
  }

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Copilot
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchRecommendations} disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>AI-driven suggestions based on real-time events.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isPending ? (
            <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-full" />
            </div>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start justify-between gap-2 p-3 bg-secondary/50 rounded-xl">
                <p className="text-sm leading-relaxed">{rec}</p>
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="shrink-0" onClick={() => handleApply(rec)}>Apply</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Wand2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No suggestions right now.</p>
            <Button variant="link" onClick={fetchRecommendations}>Check for recommendations</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         {recommendations.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground truncate" title={reasoning}>Why these?</p>
            <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={isPending}>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                More
            </Button>
          </>
         )}
      </CardFooter>
    </Card>
  );
}
