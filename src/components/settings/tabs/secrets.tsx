
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const secrets = [
    { id: 'sec_1', name: 'GitHub API Token', reference: 'vault://github/prod/api-token', lastRotated: '3 days ago', policy: '60 days' },
    { id: 'sec_2', name: 'Stripe API Key', reference: 'vault://stripe/prod/api-key', lastRotated: '28 days ago', policy: '90 days' },
    { id: 'sec_3', name: 'OpenAI API Key', reference: 'vault://openai/dev/api-key', lastRotated: '12 hours ago', policy: '30 days' },
];


export default function SettingsSecretsTab() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
        description: "The secret reference has been copied.",
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Secrets Management</CardTitle>
          <CardDescription>Manage secret references and rotation policies.</CardDescription>
        </div>
        <Button>Add Secret</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Last Rotated</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {secrets.map((secret) => (
              <TableRow key={secret.id}>
                <TableCell className="font-medium">{secret.name}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <code className="text-muted-foreground">{secret.reference}</code>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(secret.reference)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
                <TableCell>{secret.lastRotated}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-md">{secret.policy}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="rounded-lg">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Rotate
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
