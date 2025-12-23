
"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { type AuditEvent } from "@/lib/data-types";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/firebase";
import { getCurrentUserToken } from "@/lib/firebase/client";
import { useToast } from "@/components/ui/use-toast";

const severityClasses: Record<AuditEvent['severity'], string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  warn: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
  error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700",
  critical: "bg-fuchsia-200 text-fuchsia-900 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700 font-bold",
};

const resultClasses = {
    success: "text-green-500",
    fail: "text-red-500",
}

export default function AuditLogTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AuditEvent[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  const { toast } = useToast();

  const firestore = useFirestore();
  const auditLogsQuery = useMemoFirebase(() => query(collection(firestore, 'auditLogs'), orderBy('ts', 'desc')), [firestore]);
  const { data: initialLogs, isLoading } = useCollection<AuditEvent>(auditLogsQuery);

  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }

    startTransition(async () => {
      const allLogsString = JSON.stringify(initialLogs);
      try {
        const token = await getCurrentUserToken(auth);
        const response = await fetch("/api/ai/query-logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: searchQuery, logs: allLogsString }),
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const result = await response.json();
        const parsedResult = JSON.parse(result.results);
        if (Array.isArray(parsedResult)) {
          setSearchResults(parsedResult);
        } else if (parsedResult.results && Array.isArray(parsedResult.results)) {
          setSearchResults(parsedResult.results);
        } else {
          console.error("Unexpected search result format:", parsedResult);
          setSearchResults([]);
        }
      } catch (e) {
        console.error("Failed to parse search results:", e);
        toast({
          title: "Search failed",
          description: "Authentication is required to run AI search.",
          variant: "destructive",
        });
        setSearchResults([]);
      }
    });
  };
  
  const logsToDisplay = searchResults === null ? (initialLogs || []) : searchResults;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, actors, resources..."
            className="pl-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isPending || isLoading} className="rounded-xl">
          {(isPending || isLoading) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Env</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending || isLoading ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading logs...</p>
                    </TableCell>
                </TableRow>
            ) : logsToDisplay.length > 0 ? (
              logsToDisplay.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {format(parseISO(log.ts), "MMM d, HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.actor.name || log.actor.id}</div>
                    <div className="text-xs text-muted-foreground">{log.actor.email || log.actor.type}</div>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium">{log.action}</div>
                     <div className="text-xs text-muted-foreground">{log.tool}</div>
                  </TableCell>
                  <TableCell>
                    {log.resource && (
                        <div>
                            <div className="font-medium">{log.resource.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{log.resource.id}</div>
                        </div>
                    )}
                  </TableCell>
                  <TableCell className={cn("font-medium capitalize", resultClasses[log.result])}>
                    {log.result}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", severityClasses[log.severity])}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className="capitalize">{log.env}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No results found for your query.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
