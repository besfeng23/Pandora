import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-lg mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search across all services, logs, and events..." 
                className="pl-10 rounded-xl"
            />
        </div>
        <div className="text-center text-muted-foreground mt-8">
          <p>Search results will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
