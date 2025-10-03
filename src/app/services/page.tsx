import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services, type Service } from "@/lib/data";
import ServiceCard from "@/components/services/service-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="font-headline text-3xl font-semibold">Services</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter services..." 
            className="pl-10 rounded-xl"
          />
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="healthy">Healthy</TabsTrigger>
          <TabsTrigger value="degraded">Degraded</TabsTrigger>
          <TabsTrigger value="down">Down</TabsTrigger>
          <TabsTrigger value="unknown">Unknown</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="healthy">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services
              .filter((s) => s.status === "healthy")
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="degraded">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services
              .filter((s) => s.status === "degraded")
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="down">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services
              .filter((s) => s.status === "down")
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="unknown">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services
                .filter((s) => s.status === "unknown")
                .map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
