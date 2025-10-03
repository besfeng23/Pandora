import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export default function ConnectionsPage() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground mt-8">
            <Share2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">Connection graph coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
