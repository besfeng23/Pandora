"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Eye, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BridgeConfig() {
    const { toast } = useToast();
    const bridgeUrl = "https://bridge.pandora.services/v1/ingest/brg-a1b2c3d4e5";

    const handleCopy = () => {
        navigator.clipboard.writeText(bridgeUrl);
        toast({
            title: "Copied to clipboard",
            description: "Bridge URL has been copied.",
        });
    }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Bridge Configuration</CardTitle>
        <CardDescription>
          Manage your connection bridge for external integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="bridge-url">Bridge URL</Label>
            <div className="flex items-center gap-2">
                <Input id="bridge-url" type="text" value={bridgeUrl} readOnly className="rounded-xl" />
                <Button variant="outline" size="icon" className="rounded-xl" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="bridge-token">Bridge Token</Label>
            <div className="flex items-center gap-2">
                 <Input id="bridge-token" type="password" value="******************" readOnly className="rounded-xl" />
                <Button variant="outline" size="icon" className="rounded-xl">
                    <Eye className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
          <Button variant="outline" className="rounded-xl">
            <RotateCw className="mr-2 h-4 w-4" />
            Rotate Token
          </Button>
      </CardFooter>
    </Card>
  );
}
