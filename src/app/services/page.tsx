
"use client";

import * as React from "react";

/**
 * SERVICES PAGE — Device-Perfect, Backend-Ready
 * - Zero external UI deps. Pure React + Tailwind.
 * - Mobile-first layout; scales to 6 columns on wide screens.
 * - Debounced search, category/status filters, sticky toolbar on small screens.
 * - Image aspect-ratio + explicit sizes to kill CLS.
 * - Skeletons, empty states, error state.
 * - "Load more" with IntersectionObserver.
 *
 * Wire the three TODO endpoints below and you're live.
 */

// ---------- Types ----------
type Service = {
  id: string;
  name: string;
  slug: string;         // for logos: /logos/{slug}.svg or from API
  description?: string;
  category?: string;
  status: "connected" | "disconnected" | "error";
  tags?: string[];
  logoUrl?: string;     // optional explicit logo URL
  updatedAt?: string;   // ISO
};

// ---------- Config ----------
const PAGE_SIZE = 24;
const CATEGORIES = [
  "Auth",
  "Databases",
  "Storage",
  "Messaging",
  "Monitoring",
  "Payments",
  "AI/ML",
  "DevOps",
  "Other"
] as const;

const STATUS = ["connected", "disconnected", "error"] as const;

// ---------- Small utilities ----------
function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function useDebouncedValue<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// ---------- API calls (wire these) ----------
async function fetchServices(params: {
  q: string;
  category: string;
  status: string;
  page: number;
  pageSize: number;
}): Promise<{ items: Service[]; hasMore: boolean }> {
  // TODO: Swap this for your backend. Contract suggestion:
  // GET /api/services?q=&category=&status=&page=&pageSize=
  // return await (await fetch(url)).json()

  // Placeholder: pretend to fetch and filter locally.
  const all: Service[] = DEMO_DATA; // Replace with real data
  let filtered = all;

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
    );
  }
  if (params.category) {
    filtered = filtered.filter(s => s.category === params.category);
  }
  if (params.status) {
    filtered = filtered.filter(s => s.status === params.status);
  }

  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);
  return { items, hasMore: start + params.pageSize < filtered.length };
}

async function connectService(id: string): Promise<{ ok: boolean; message?: string }> {
  // TODO: POST /api/services/:id/connect
  await new Promise(r => setTimeout(r, 450));
  return { ok: true };
}

async function disconnectService(id: string): Promise<{ ok: boolean; message?: string }> {
  // TODO: POST /api/services/:id/disconnect
  await new Promise(r => setTimeout(r, 450));
  return { ok: true };
}

// ---------- Page component ----------
export default function ServicesPage() {
  // filters
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("");

  // data
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<Service[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // for connect/disconnect feedback
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  // reset pagination when filters or search change
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const res = await fetchServices({
          q: debouncedQuery,
          category,
          status,
          page: 1,
          pageSize: PAGE_SIZE
        });
        if (cancelled) return;
        setItems(res.items);
        setHasMore(res.hasMore);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load services.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, category, status]);

  // load more on intersection
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!hasMore || loading) return;
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: "600px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading]);

  // fetch next pages
  React.useEffect(() => {
    if (page === 1) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchServices({
          q: debouncedQuery,
          category,
          status,
          page,
          pageSize: PAGE_SIZE
        });
        if (cancelled) return;
        setItems(prev => prev.concat(res.items));
        setHasMore(res.hasMore);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load more services.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // handlers
  const onConnect = async (id: string) => {
    try {
      setBusyId(id);
      const res = await connectService(id);
      if (!res.ok) throw new Error(res.message || "Connect failed");
      setItems(prev => prev.map(s => (s.id === id ? { ...s, status: "connected" } : s)));
      setToast({ type: "success", msg: "Connected." });
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message || "Connect failed" });
    } finally {
      setBusyId(null);
    }
  };

  const onDisconnect = async (id: string) => {
    try {
      setBusyId(id);
      const res = await disconnectService(id);
      if (!res.ok) throw new Error(res.message || "Disconnect failed");
      setItems(prev => prev.map(s => (s.id === id ? { ...s, status: "disconnected" } : s)));
      setToast({ type: "success", msg: "Disconnected." });
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message || "Disconnect failed" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900">
      {/* Page shell */}
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5">
        <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Services</h1>
            <p className="text-sm text-neutral-600">
              Integrate providers across auth, data, storage, payments, and more. Built for screens from 320 to IMAX.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/services/catalog"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50"
            >
              Browse catalog
            </a>
          </div>
        </header>

        {/* Toolbar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/70">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* search */}
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search services, tags, descriptions…"
                  aria-label="Search services"
                  className="w-full h-10 rounded-lg border border-neutral-300 bg-white px-3 pr-9 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
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
                className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm"
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
                className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm"
              >
                <option value="">All status</option>
                {STATUS.map(s => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="py-5">
          {error ? (
            <ErrorState message={error} onRetry={() => setPage(1)} />
          ) : (
            <>
              {loading && items.length === 0 ? (
                <SkeletonGrid />
              ) : items.length === 0 ? (
                <EmptyState
                  onClear={() => {
                    setQuery("");
                    setCategory("");
                    setStatus("");
                  }}
                />
              ) : (
                <>
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                  >
                    {items.map(s => (
                      <li key={s.id}>
                        <ServiceCard
                          service={s}
                          busy={busyId === s.id}
                          onConnect={() => onConnect(s.id)}
                          onDisconnect={() => onDisconnect(s.id)}
                        />
                      </li>
                    ))}
                  </ul>
                  {/* loader sentinel */}
                  {hasMore && (
                    <div ref={loaderRef} className="py-8 text-center text-sm text-neutral-500">
                      Loading more…
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={clsx(
            "fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-3 py-2 text-sm shadow",
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          )}
          onAnimationEnd={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ---------- Card ----------
function ServiceCard({
  service,
  busy,
  onConnect,
  onDisconnect
}: {
  service: Service;
  busy: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const connected = service.status === "connected";
  const error = service.status === "error";
  const initial = service.name?.[0]?.toUpperCase() ?? "?";
  const logo = service.logoUrl || `/logos/${service.slug}.svg`;

  return (
    <article className="group h-full rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_1px_0_#0000000f] transition-colors hover:border-neutral-300">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-inset ring-neutral-200">
          {/* Use explicit width/height + lazy to avoid CLS */}
          <img
            src={logo}
            alt=""
            loading="lazy"
            width="40"
            height="40"
            className="h-full w-full object-contain p-1.5"
            onError={e => {
              const el = e.currentTarget;
              el.style.display = "none";
              const parent = el.parentElement;
              if (!parent) return;
              const fallback = document.createElement("div");
              fallback.className =
                "absolute inset-0 grid place-items-center text-sm font-semibold text-neutral-500";
              fallback.textContent = initial;
              parent.appendChild(fallback);
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-medium">
              <span className="align-middle">{service.name}</span>
              <span className="ml-2 align-middle text-[11px] font-normal text-neutral-500">
                {service.category || "Other"}
              </span>
            </h3>
            <StatusBadge status={service.status} />
          </div>
          {service.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-600">
              {service.description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-neutral-400">No description.</p>
          )}

          {service.tags && service.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {service.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600"
                >
                  {tag}
                </span>
              ))}
              {service.tags.length > 4 && (
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-500">
                  +{service.tags.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-[11px] text-neutral-500">Updated {timeAgo(service.updatedAt)}</div>
            <div className="flex gap-1.5">
              {!connected ? (
                <button
                  disabled={busy}
                  onClick={onConnect}
                  className={clsx(
                    "inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium",
                    "border border-emerald-600 text-emerald-700 hover:bg-emerald-50",
                    busy && "opacity-60"
                  )}
                >
                  {busy ? "Connecting…" : "Connect"}
                </button>
              ) : (
                <>
                  <a
                    href={`/services/${service.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200 px-2.5 text-xs hover:bg-neutral-50"
                  >
                    Manage
                  </a>
                  <button
                    disabled={busy}
                    onClick={onDisconnect}
                    className={clsx(
                      "inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium",
                      "border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
                      busy && "opacity-60"
                    )}
                  >
                    {busy ? "…" : "Disconnect"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---------- Status badge ----------
function StatusBadge({ status }: { status: Service["status"] }) {
  const styles =
    status === "connected"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-neutral-50 text-neutral-700 border-neutral-200";
  const label =
    status === "connected" ? "Connected" : status === "error" ? "Error" : "Disconnected";
  return (
    <span
      className={clsx(
        "inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-medium",
        styles
      )}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

// ---------- Empty / Error / Skeleton ----------
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-neutral-300 bg-white py-16">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-neutral-300 bg-neutral-50" />
        <h2 className="text-sm font-medium">No services found</h2>
        <p className="mx-auto mt-1 max-w-sm px-6 text-xs text-neutral-600">
          Try another search term or clear filters. If you’re expecting data, verify the backend
          endpoint is returning items.
        </p>
        <div className="mt-4">
          <button
            onClick={onClear}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 text-sm hover:bg-neutral-50"
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
    <div className="grid place-items-center rounded-xl border border-red-200 bg-red-50 py-12">
      <div className="text-center">
        <h2 className="text-sm font-semibold text-red-800">Failed to load</h2>
        <p className="mt-1 text-xs text-red-700">{message}</p>
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-300 bg-white px-3 text-sm text-red-700 hover:bg-red-50"
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
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-neutral-200" />
            <div className="min-w-0 flex-1">
              <div className="h-3 w-40 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-5/6 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-3/5 rounded bg-neutral-200" />
              <div className="mt-4 flex gap-2">
                <div className="h-7 w-16 rounded bg-neutral-200" />
                <div className="h-7 w-20 rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ---------- Demo data (delete when wired) ----------
const DEMO_DATA: Service[] = [
  {
    id: "1",
    name: "Auth0",
    slug: "auth0",
    description: "Enterprise authentication and SSO.",
    category: "Auth",
    status: "connected",
    tags: ["OIDC", "SAML", "M2M"],
    updatedAt: new Date(Date.now() - 3600_000).toISOString()
  },
  {
    id: "2",
    name: "Firestore",
    slug: "firestore",
    description: "Serverless NoSQL with realtime streams.",
    category: "Databases",
    status: "disconnected",
    tags: ["GCP", "NoSQL"],
    updatedAt: new Date(Date.now() - 6 * 3600_000).toISOString()
  },
  {
    id: "3",
    name: "Stripe",
    slug: "stripe",
    description: "Payments, invoicing, and checkout.",
    category: "Payments",
    status: "error",
    tags: ["webhooks", "payouts"],
    updatedAt: new Date(Date.now() - 2 * 24 * 3600_000).toISOString()
  },
  // add as many as you like to test scrolling
];

    