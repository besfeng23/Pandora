
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getPersonalizedRecommendations } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Service } from "@/lib/data-types";

export default function AiCopilot() {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'services'), limit(10)) : null, [firestore]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const fetchRecommendations = () => {
    if (servicesLoading || !services) return;
    
    startTransition(async () => {
      const systemState = services.map(s => `${s.name} ${s.status}`).join(', ');

      const result = await getPersonalizedRecommendations({
        userNeeds: "Improve system stability and reduce latency.",
        userPreferences: "Prefer non-disruptive actions, prioritize cost-saving.",
        systemState: systemState || "No services found."
      });
      if (result && result.recommendations.length > 0) {
        setRecommendations(result);
      } else {
        toast({
          title: "AI Copilot",
          description: result?.reasoning || "No new recommendations found.",
        });
      }
    });
  };
  
  useEffect(() => {
    if (!servicesLoading && services) {
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, servicesLoading])

  const handleApply = (recommendation: string) => {
    const prompt = encodeURIComponent(recommendation);
    router.push(`/actions?prompt=${prompt}`);
  }

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Copilot
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchRecommendations} disabled={isPending || servicesLoading}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>AI-driven suggestions based on real-time events.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {(isPending || servicesLoading) && !recommendations ? (
            <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-full" />
            </div>
        ) : recommendations && recommendations.recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start justify-between gap-2 p-3 bg-secondary/50 rounded-xl">
                <p className="text-sm leading-relaxed">{rec}</p>
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="shrink-0" onClick={() => handleApply(rec)}>View Action</Button>
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
         {recommendations && recommendations.recommendations.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground truncate" title={recommendations.reasoning}>Why these?</p>
            <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={isPending || servicesLoading}>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                More
            </Button>
          </>
         )}
      </CardFooter>
    </Card>
  );
}
