
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, FileText, LayoutGrid, BookOpen, Loader2 } from "lucide-react";
import { services } from '@/lib/data';

type SearchResult = {
  title: string;
  description: string;
  href: string;
}

type SearchResults = {
  services: SearchResult[];
  audit: SearchResult[];
  docs: SearchResult[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleSearch = () => {
    if (!query) {
      setResults(null);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults({
        services: services.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
          .map(s => ({ title: s.name, description: `Service - ${s.status}`, href: `/services/${s.id}` })),
        audit: [
          { title: `User login failed: ${query}`, description: 'Audit Event - ID: evt-12345', href: '/audit' },
          { title: 'API Key rotation', description: 'Audit Event - ID: evt-12346', href: '/audit' },
        ],
        docs: [
          { title: `Documentation for '${query}'`, description: 'Connecting to the Billing API', href: '#' },
        ]
      });
      setLoading(false);
    }, 1000);
  }

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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for 'Billing API', user emails, incident IDs..." 
                  className="pl-10 h-11 rounded-xl text-base"
              />
              <Button onClick={handleSearch} disabled={loading} className="h-11 rounded-xl">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center p-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Searching...</p>
        </div>
      ) : results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ResultSection title="Services" icon={LayoutGrid} items={results.services} />
          <ResultSection title="Audit Logs" icon={FileText} items={results.audit} />
          <ResultSection title="Documentation" icon={BookOpen} items={results.docs} />
        </div>
      )}
    </div>
  );
}
