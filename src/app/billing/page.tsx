
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Download, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { BillingSummary, CostByService, RecentCharge } from "@/lib/data-types";

export default function BillingPage() {
  const firestore = useFirestore();

  const summaryQuery = useMemoFirebase(() => firestore ? collection(firestore, 'billingSummary'): null, [firestore]);
  const costByServiceQuery = useMemoFirebase(() => firestore ? collection(firestore, 'costByService') : null, [firestore]);
  const recentChargesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'recentCharges') : null, [firestore]);

  const { data: summaryData, isLoading: summaryLoading } = useCollection<BillingSummary>(summaryQuery);
  const { data: costByService, isLoading: costByServiceLoading } = useCollection<CostByService>(costByServiceQuery);
  const { data: recentCharges, isLoading: recentChargesLoading } = useCollection<RecentCharge>(recentChargesQuery);

  const billingSummary = summaryData?.[0];
  const isLoading = summaryLoading || costByServiceLoading || recentChargesLoading;

  if (isLoading || !billingSummary || !costByService || !recentCharges) {
    return <BillingPageSkeleton />;
  }

  const progress = (billingSummary.mtdCost / billingSummary.budget) * 100;
  const mtdCost = billingSummary.mtdCost;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div>
                {/* This title is now handled by the global header */}
            </div>
            <Button className="rounded-xl"><Download className="mr-2" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><DollarSign/> Month-to-date Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${billingSummary.mtdCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp/> Forecasted Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${billingSummary.forecastedCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
            <CardDescription>${billingSummary.budget.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2"/>
            <p className="text-xs text-muted-foreground mt-2">{progress.toFixed(0)}% of budget used</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Cost by Service</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {costByService.map(service => (
                        <div key={service.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{service.name}</span>
                                <span className="text-muted-foreground">${service.cost.toLocaleString()}</span>
                            </div>
                            <Progress value={(service.cost / mtdCost) * 100} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-7 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Recent Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCharges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell className="font-medium">{charge.description}</TableCell>
                    <TableCell className="text-muted-foreground">{charge.date}</TableCell>
                    <TableCell className="text-right font-mono">${charge.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BillingPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary"><CreditCard /></div>
                <div>
                    
                    <p className="text-muted-foreground">Track your cloud spend and resource usage.</p>
                </div>
            </div>
            <Button className="rounded-xl"><Download className="mr-2" /> Export Report</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-5 h-80 rounded-2xl" />
        <Skeleton className="lg:col-span-7 h-80 rounded-2xl" />
      </div>
    </div>
  )
}
