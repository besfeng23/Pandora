import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const diffContent = `--- a/.env.example
+++ b/.env.example
@@ -1,5 +1,6 @@
 # Pandora Settings
-DATABASE_URL="postgresql://user:pass@localhost:5432/pandora"
+DATABASE_URL="postgresql://prod_user:********@prod.db.pandora.cloud:5432/pandora"
 REDIS_URL="redis://localhost:6379"
+ENABLE_FEATURE_GALAXY_MAP=true
 
 # External Integrations
 PAGERDUTY_API_KEY="your-pagerduty-api-key"
`;

export default function EnvImport() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">.env Import</CardTitle>
        <CardDescription>
          Import and diff settings from a .env file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild variant="outline" className="w-full rounded-xl">
            <label htmlFor="env-file-upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload .env file
                <input id="env-file-upload" type="file" className="sr-only" />
            </label>
        </Button>

        <div className="space-y-2">
            <p className="text-sm font-medium">Configuration Diff</p>
            <ScrollArea className="h-48 w-full rounded-xl border p-4">
                <pre className="text-xs">
                    <code>
                        {diffContent.split('\n').map((line, i) => {
                            const colorClass = line.startsWith('+') 
                                ? 'bg-green-500/20 text-green-200' 
                                : line.startsWith('-') 
                                ? 'bg-red-500/20 text-red-200' 
                                : '';
                            return <div key={i} className={colorClass}>{line}</div>
                        })}
                    </code>
                </pre>
            </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
