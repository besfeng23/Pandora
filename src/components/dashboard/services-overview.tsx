
"use client";

import ServiceCard from "@/components/services/service-card-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, limit, query } from "firebase/firestore";
import type { Service } from "@/lib/data-types";
import { Skeleton } from "../ui/skeleton";

export default function ServicesOverview() {
  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'services'), limit(6)) : null
  , [firestore]);
  const { data: overviewServices, isLoading } = useCollection<Service>(servicesQuery);

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Services Overview</CardTitle>
          <CardDescription>A snapshot of your key services.</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
            <Link href="/services">
                View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-[92px] rounded-xl" />)}
            </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overviewServices?.map((service) => (
              <Link href={`/services/${service.id}`} key={service.id}>
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
