
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
import { BookOpen, PlayCircle, PlusCircle, Book, Code, Database, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";

type Runbook = {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
}

const iconMap: { [key: string]: LucideIcon } = {
    Database,
    Code,
    Book,
    default: BookOpen,
}

export default function RunbooksPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const runbooksQuery = useMemoFirebase(() => firestore ? collection(firestore, 'runbooks') : null, [firestore]);
  const { data: runbooks, isLoading } = useCollection<Runbook>(runbooksQuery);

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

        {isLoading ? (
             <div className="text-center p-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Loading runbooks...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(runbooks || []).map((runbook) => {
                    const Icon = iconMap[runbook.icon] || iconMap.default;
                    return (
                        <Card key={runbook.id} className="rounded-2xl shadow-lg flex flex-col">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <Icon className="h-6 w-6 text-muted-foreground mt-1" />
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
                    )
                })}
            </div>
        )}
    </div>
  );
}
