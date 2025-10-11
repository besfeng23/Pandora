
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Connection } from '@/lib/data-types';
import { fmtRel } from '@/lib/utils';

export default function SettingsSecretsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const connectionsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'connections')) : null),
    [firestore]
  );
  const { data: connections, isLoading } = useCollection<Connection>(
    connectionsQuery
  );

  const secrets = (connections ?? [])
    .filter(c => c.secretRef)
    .map(c => ({
      id: c.id,
      name: `${c.name} Secret`,
      reference: c.secretRef || 'N/A',
      lastRotated: c.lastRotatedISO ? fmtRel(c.lastRotatedISO) : 'Never',
      policy: '90 days', // Mock data
    }));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'The secret reference has been copied.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Secrets Management</CardTitle>
          <CardDescription>
            Manage secret references and rotation policies.
          </CardDescription>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : secrets.length > 0 ? (
              secrets.map(secret => (
                <TableRow key={secret.id}>
                  <TableCell className="font-medium">{secret.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-muted-foreground">
                        {secret.reference}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(secret.reference)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{secret.lastRotated}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-md">
                      {secret.policy}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Rotate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No secrets found. Add a connection to see its secret here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
