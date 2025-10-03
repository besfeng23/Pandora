import { services } from "@/lib/data";
import ServiceCard from "@/components/services/service-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function ServicesOverview() {
  const overviewServices = services.slice(0, 6);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
