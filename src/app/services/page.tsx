
"use client";

import * as React from "react";
import { ServiceIcon } from "@/components/services/service-icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDebounced } from "@/hooks/use-client-helpers";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Service } from "@/lib/data-types";

// ---------- Config ----------
const PAGE_SIZE = 24;
const CATEGORIES = ["core", "billing", "api", "user", "db", "media", "worker", "data", "realtime", "storage", "aws", "devops", "automation", "integration", "events", "cli", "tooling", "docs", "generator"] as const;

const STATUS = ["healthy", "degraded", "down", "unknown"] as const;

// ---------- API calls (wired to mock data) ----------
async function fetchServices(params: {
  q: string;
  category: string;
  status: string;
  page: number;
  pageSize: number;
}): Promise<{ items: Service[]; hasMore: boolean }> {
  // This would be a firestore query in real life
  await new Promise(r => setTimeout(r, 300));
  return { items: [], hasMore: false };
}


// ---------- Page component ----------
export default function ServicesPage() {
  const firestore = useFirestore();
  // filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedQuery = useDebounced(searchQuery, 300);
  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("");

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const constraints = [];
    if (category) {
      constraints.push(where('tags', 'array-contains', category));
    }
    if (status) {
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* search */}
            <div className="relative flex-1">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services, tags…"
                aria-label="Search services"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-ring"
              />
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              >
                <path
                  fill="currentColor"
                  d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm8.707 12.293-3.388-3.388A7.963 7.963 0 0 0 18 10a8 8 0 1 0-8 8 7.963 7.963 0 0 0 2.905-.681l3.388 3.388a1 1 0 1 0 1.414-1.414Z"
                />
              </svg>
            </div>

            {/* category */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm capitalize"
            >
              <option value="">All categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* status */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm capitalize"
            >
              <option value="">All status</option>
              {STATUS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
                  setCategory("");
                  setStatus("");
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

// ---------- Card ----------
function ServiceCard({
  service,
}: {
  service: Service;
}) {
  return (
    <article className="group h-full rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-ring flex flex-col">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-muted ring-1 ring-inset ring-border">
          <ServiceIcon name={service.icon} className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              <span className="align-middle">{service.name}</span>
            </h3>
            <StatusBadge status={service.status} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {service.tags.join(', ')}
          </div>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div><div className="text-slate-400 dark:text-slate-500">p95</div><div className="font-medium">{service.p95_ms} ms</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">errors</div><div className="font-medium">{service.err_rate_pct}%</div></div>
          <div><div className="text-slate-400 dark:text-slate-500">req/s</div><div className="font-medium">{service.rps}</div></div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
         <div className="text-[11px] text-muted-foreground">Commit <code className="font-mono">{service.commit.slice(0,7)}</code></div>
          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-input px-2.5 text-xs hover:bg-accent"
          >
            Manage
          </Link>
      </div>
    </article>
  );
}


// ---------- Status badge ----------
function StatusBadge({ status }: { status: Service["status"] }) {
  const styles =
    status === "healthy"
      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500/30"
      : status === "degraded"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-500/30"
      : status === "down"
      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/30"
      : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700";
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize text-xs rounded-md",
        styles
      )}
      aria-label={`Status: ${status}`}
    >
      {status}
    </Badge>
  );
}

// ---------- Empty / Error / Skeleton ----------
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card py-16">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-border bg-muted" />
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
            <div className="mt-4 grid grid-cols-3 gap-3">
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

    