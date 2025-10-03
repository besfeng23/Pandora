"use client";

import { useState, useTransition } from "react";
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
import { auditLogs as initialLogs, type AuditLog } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { queryLogs } from "@/lib/actions";

const severityClasses = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
  error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700",
  critical: "bg-fuchsia-200 text-fuchsia-900 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700 font-bold",
};

export default function AuditLogTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AuditLog[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }

    startTransition(async () => {
      const allLogsString = JSON.stringify(initialLogs);
      const result = await queryLogs({ query: searchQuery, logs: allLogsString });
      try {
        // The AI sometimes returns a JSON object with a 'results' key, and sometimes just the array.
        const parsedResult = JSON.parse(result.results);
        if (Array.isArray(parsedResult)) {
          setSearchResults(parsedResult);
        } else if (parsedResult.results && Array.isArray(parsedResult.results)) {
           setSearchResults(parsedResult.results);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.error("Failed to parse search results:", e);
        setSearchResults([]);
      }
    });
  };
  
  const logsToDisplay = searchResults === null ? initialLogs : searchResults;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Use natural language to search logs... (e.g., 'failed logins today')"
            className="pl-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isPending} className="rounded-xl">
          {isPending ? (
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
              <TableHead className="w-[120px]">Event</TableHead>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="w-[180px]">User</TableHead>
              <TableHead className="w-[200px] text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Analyzing logs...</p>
                    </TableCell>
                </TableRow>
            ) : logsToDisplay.length > 0 ? (
              logsToDisplay.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", severityClasses[log.severity])}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell className="text-muted-foreground">{log.user}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(parseISO(log.timestamp), "MMM d, yyyy, HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
