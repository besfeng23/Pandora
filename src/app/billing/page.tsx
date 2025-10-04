
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Download, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const billingData = {
  mtdCost: 1234.56,
  forecastedCost: 2500.00,
  budget: 3000.00,
  costByService: [
    { name: "Compute", cost: 650.12, color: "bg-blue-500" },
    { name: "Storage", cost: 234.56, color: "bg-green-500" },
    { name: "Database", cost: 150.88, color: "bg-yellow-500" },
    { name: "Networking", cost: 100.00, color: "bg-purple-500" },
    { name: "Other", cost: 99.00, color: "bg-gray-500" },
  ],
  recentCharges: [
    { id: "ch_1", description: "GCP Compute Engine", amount: 25.50, date: "2023-10-26" },
    { id: "ch_2", description: "AWS S3 Storage", amount: 12.34, date: "2023-10-26" },
    { id: "ch_3", description: "Stripe Transaction Fees", amount: 8.99, date: "2023-10-25" },
    { id: "ch_4", description: "Neon DB", amount: 20.00, date: "2023-10-25" },
  ],
};

export default function BillingPage() {
  const progress = (billingData.mtdCost / billingData.budget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary"><CreditCard /></div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Billing & Usage</h1>
                    <p className="text-muted-foreground">Track your cloud spend and resource usage.</p>
                </div>
            </div>
            <Button className="rounded-xl"><Download className="mr-2" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><DollarSign/> Month-to-date Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${billingData.mtdCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp/> Forecasted Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${billingData.forecastedCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
            <CardDescription>${billingData.budget.toLocaleString()}</CardDescription>
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
                    {billingData.costByService.map(service => (
                        <div key={service.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{service.name}</span>
                                <span className="text-muted-foreground">${service.cost.toLocaleString()}</span>
                            </div>
                            <Progress value={(service.cost / billingData.mtdCost) * 100} className="h-2" />
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
                {billingData.recentCharges.map((charge) => (
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
