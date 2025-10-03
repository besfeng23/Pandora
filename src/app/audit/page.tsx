import AuditLogTable from "@/components/audit/audit-log-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AuditPage() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Audit Log</CardTitle>
        <CardDescription>An immutable log of all system and user events.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuditLogTable />
      </CardContent>
    </Card>
  );
}
