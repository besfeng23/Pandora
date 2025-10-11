
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, FileText, LayoutGrid, BookOpen, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import type { Service, AuditEvent, Runbook } from "@/lib/data-types";

type SearchResult = {
  title: string;
  description: string;
  href: string;
}

type SearchResults = {
  services: SearchResult[];
  audit: SearchResult[];
  runbooks: SearchResult[];
}

export default function SearchPage() {
  const [queryVal, setQueryVal] = useState('');
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchResults | null>(null);

  const firestore = useFirestore();
  
  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !queryVal) return null;
    return query(collection(firestore, 'services'), where('name', '>=', queryVal), where('name', '<=', queryVal + '\uf8ff'), limit(3));
  }, [firestore, queryVal]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const auditLogsQuery = useMemoFirebase(() => {
    if (!firestore || !queryVal) return null;
    return query(collection(firestore, 'auditLogs'), where('action', '>=', queryVal), where('action', '<=', queryVal + '\uf8ff'), limit(3));
  }, [firestore, queryVal]);
  const { data: auditLogs, isLoading: auditLoading } = useCollection<AuditEvent>(auditLogsQuery);

  const runbooksQuery = useMemoFirebase(() => {
    if (!firestore || !queryVal) return null;
    return query(collection(firestore, 'runbooks'), where('title', '>=', queryVal), where('title', '<=', queryVal + '\uf8ff'), limit(3));
  }, [firestore, queryVal]);
  const { data: runbooks, isLoading: runbooksLoading } = useCollection<Runbook>(runbooksQuery);

  const handleSearch = () => {
    if (!queryVal) {
      setResults(null);
      return;
    }
    startTransition(() => {
      setResults({
        services: (services || []).map(s => ({ title: s.name, description: `Service - ${s.status}`, href: `/services/${s.id}` })),
        audit: (auditLogs || []).map(a => ({ title: a.action, description: `Audit Event - ${a.id.slice(0,8)}`, href: `/audit` })),
        runbooks: (runbooks || []).map(r => ({ title: r.title, description: `Runbook - ${r.category}`, href: `/runbooks` })),
      });
    });
  }
  
  const isLoading = servicesLoading || auditLoading || runbooksLoading || isPending;

  const ResultSection = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: SearchResult[] }) => (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i}>
                <a href={item.href} className="block p-3 rounded-lg hover:bg-muted">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No results found in {title}.</p>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl font-semibold">Global Search</CardTitle>
          <CardDescription>Search across all services, logs, and documentation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-2xl mx-auto flex gap-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  value={queryVal}
                  onChange={(e) => setQueryVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for 'Billing API', user emails, incident IDs..." 
                  className="pl-10 h-11 rounded-xl text-base"
              />
              <Button onClick={handleSearch} disabled={isLoading} className="h-11 rounded-xl">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && !results ? (
        <div className="text-center p-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Searching...</p>
        </div>
      ) : results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ResultSection title="Services" icon={LayoutGrid} items={results.services} />
          <ResultSection title="Audit Logs" icon={FileText} items={results.audit} />
          <ResultSection title="Runbooks" icon={BookOpen} items={results.runbooks} />
        </div>
      )}
    </div>
  );
}
