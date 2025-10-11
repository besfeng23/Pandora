
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Role, UserProfile } from '@/lib/data-types';
import { Loader2 } from 'lucide-react';

const roleColors: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  Admin: 'destructive',
  Developer: 'secondary',
  Viewer: 'default',
};

export default function SettingsAccessTab() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users')) : null),
    [firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const rolesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'roles')) : null),
    [firestore]
  );
  const { data: roles, isLoading: rolesLoading } = useCollection<Role>(rolesQuery);

  const getRoleName = (roleId: string | undefined) => {
    if (!roles || !roleId) return 'N/A';
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  const isLoading = usersLoading || rolesLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Access Management</CardTitle>
          <CardDescription>
            Manage who can access your system and their roles.
          </CardDescription>
        </div>
        <Button>Invite user</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : (
              users?.map(user => {
                const roleName = getRoleName(user.roleId);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar && <AvatarImage src={user.avatar} />}
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={roleColors[roleName] || 'default'}
                        className="rounded-md"
                      >
                        {roleName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastActive || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
