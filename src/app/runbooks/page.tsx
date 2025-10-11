
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
import { Book, BookOpen, Code, Database, Loader2, PlayCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                    
                    <p className="text-muted-foreground">Standardized operational procedures for your team.</p>
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="rounded-xl"><PlusCircle /> Create Runbook</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Runbook</DialogTitle>
                        <DialogDescription>Define a new operational procedure.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" placeholder="e.g. Database Failover" className="col-span-3 rounded-xl" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="rounded-xl">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length: 6}).map((_, i) => (
                    <Card key={i} className="rounded-2xl shadow-lg">
                        <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                        <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                    </Card>
                ))}
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
                                    <PlayCircle />
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
