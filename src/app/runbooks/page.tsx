
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, PlusCircle, Book, Code, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const runbooks = [
  {
    title: "Database Failover Procedure",
    description: "Execute a manual failover for the primary user database. Estimated duration: 15 mins.",
    category: "Databases",
    icon: Database,
  },
  {
    title: "New Developer Onboarding",
    description: "Provision access and tools for a new developer joining the team.",
    category: "Access",
    icon: Code,
  },
  {
    title: "Purge CDN Cache",
    description: "Globally purge the CDN cache for all static assets.",
    category: "Infrastructure",
    icon: Book,
  },
];

export default function RunbooksPage() {
  const { toast } = useToast();

  const handleExecute = (title: string) => {
    toast({
      title: "Executing Runbook...",
      description: `The '${title}' runbook has been initiated.`,
    });
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary"><BookOpen /></div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Runbooks</h1>
                    <p className="text-muted-foreground">Standardized operational procedures for your team.</p>
                </div>
            </div>
            <Button className="rounded-xl"><PlusCircle className="mr-2" /> Create Runbook</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {runbooks.map((runbook, index) => (
            <Card key={index} className="rounded-2xl shadow-lg flex flex-col">
                <CardHeader>
                    <div className="flex items-start gap-3">
                        <runbook.icon className="h-6 w-6 text-muted-foreground mt-1" />
                        <div>
                            <CardTitle>{runbook.title}</CardTitle>
                            <CardDescription>{runbook.category}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{runbook.description}</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full rounded-xl" onClick={() => handleExecute(runbook.title)}>
                        <PlayCircle className="mr-2"/>
                        Execute
                    </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
    </div>
  );
}
