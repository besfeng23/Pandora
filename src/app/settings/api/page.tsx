
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, KeyRound } from "lucide-react";

export default function SettingsApiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg text-primary"><Code /></div>
        <div>
            <h1 className="text-2xl font-bold font-headline">API Access</h1>
            <p className="text-muted-foreground">Manage API keys and access tokens for programmatic access.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            These keys are for server-to-server communication. Do not expose them on the client-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">Default API Key</p>
              <p className="text-sm text-muted-foreground font-mono">pan_sk_test_••••••••••••</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">Read-only Key</p>
              <p className="text-sm text-muted-foreground font-mono">pan_sk_readonly_••••••••</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
          <Button><KeyRound className="mr-2 h-4 w-4" /> Create new key</Button>
        </CardContent>
      </Card>
    </div>
  );
}

    