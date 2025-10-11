
"use client";

import * as React from "react";
import { useDebounced } from "@/hooks/use-client-helpers";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Service } from "@/lib/data-types";
import ServiceCard from "@/components/services/service-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

// ---------- Config ----------
const CATEGORIES = ["core", "billing", "api", "user", "db", "media", "worker", "data", "realtime", "storage", "aws", "devops", "automation", "integration", "events", "cli", "tooling", "docs", "generator"] as const;
const STATUS = ["healthy", "degraded", "down", "unknown"] as const;

// ---------- Page component ----------
export default function ServicesPage() {
  const firestore = useFirestore();
  // filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedQuery = useDebounced(searchQuery, 300);
  const [category, setCategory] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const constraints = [];
    if (category !== "all") {
      constraints.push(where('tags', 'array-contains', category));
    }
    if (status !== "all") {
      constraints.push(where('status', '==', status));
    }
    return query(collection(firestore, 'services'), ...constraints);
  }, [firestore, category, status]);

  const { data: allServices, isLoading: loading, error } = useCollection<Service>(servicesQuery);

  const items = React.useMemo(() => {
    if (!allServices) return [];
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      return allServices.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return allServices;
  }, [allServices, debouncedQuery]);


  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-[68px] z-20 -mx-6 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services, tags…"
                aria-label="Search services"
                className="w-full h-10 rounded-lg bg-background pl-10 text-sm"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 rounded-lg border-input bg-background text-sm capitalize w-full sm:w-auto">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 rounded-lg border-input bg-background text-sm capitalize w-full sm:w-auto">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="py-5">
        {error ? (
          <ErrorState message={error.message} onRetry={() => {}} />
        ) : (
          <>
            {loading && items.length === 0 ? (
              <SkeletonGrid />
            ) : items.length === 0 ? (
              <EmptyState
                onClear={() => {
                  setSearchQuery("");
                  setCategory("all");
                  setStatus("all");
                }}
              />
            ) : (
              <>
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {items.map(s => (
                    <li key={s.id}>
                      <ServiceCard
                        service={s}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}

// ---------- Error States ----------
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card py-16">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-border bg-muted grid place-items-center"><Search className="h-5 w-5 text-muted-foreground" /></div>
        <h2 className="text-sm font-medium">No services found</h2>
        <p className="mx-auto mt-1 max-w-sm px-6 text-xs text-muted-foreground">
          Try another search term or clear filters.
        </p>
        <div className="mt-4">
          <button
            onClick={onClear}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm hover:bg-accent"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 py-12">
      <div className="text-center">
        <h2 className="text-sm font-semibold text-red-800 dark:text-red-200">Failed to load</h2>
        <p className="mt-1 text-xs text-red-700 dark:text-red-300">{message}</p>
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-300 dark:border-red-700 bg-background dark:bg-red-900/30 px-3 text-sm text-red-700 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul
      role="list"
      aria-label="Loading services"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-5 w-16 rounded-md bg-muted" />
                </div>
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <div className="h-3 w-8 rounded bg-muted/50" />
                    <div className="h-4 w-12 rounded bg-muted" />
                </div>
                <div className="space-y-1">
                    <div className="h-3 w-10 rounded bg-muted/50" />
                    <div className="h-4 w-14 rounded bg-muted" />
                </div>
                 <div className="space-y-1">
                    <div className="h-3 w-8 rounded bg-muted/50" />
                    <div className="h-4 w-10 rounded bg-muted" />
                </div>
            </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
             <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-8 w-20 rounded-lg bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}

    