import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function QuickActionsPage() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground mt-8">
            <Zap className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">Quick actions coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
