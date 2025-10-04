import AuditLogTable from "@/components/audit/audit-log-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AuditPage() {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <aside className="col-span-3">
         <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your search.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center p-8">Filter controls coming soon.</p>
            </CardContent>
        </Card>
      </aside>
      <main className="col-span-6">
        <Card className="rounded-2xl shadow-lg w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl font-semibold">Audit Log</CardTitle>
                <CardDescription>An immutable log of all system and user events.</CardDescription>
            </CardHeader>
            <CardContent>
                <AuditLogTable />
            </CardContent>
        </Card>
      </main>
      <aside className="col-span-3">
         <Card className="rounded-2xl shadow-lg h-full">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Analysis of current view.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center p-8">AI Copilot insights coming soon.</p>
            </CardContent>
        </Card>
      </aside>
    </div>
  );
}
